import discord
from discord.ext import commands
import os
import json
import shutil
from datetime import timedelta

from commands import currency

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="mb!", intents=intents)

LEVEL_FILE = "/data/levels.json"
BALANCE_FILE = "/data/balance.json"

if os.path.isdir(LEVEL_FILE):
    shutil.rmtree(LEVEL_FILE)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')
    print("Bot is online!")
    
    for filename in os.listdir('./commands'):
        if filename.endswith('.py') and filename != '__init__.py':
            try:
                bot.load_extension(f'commands.{filename[:-3]}')
                print(f"Loaded {filename}")
            except Exception as e:
                print(f"Failed to load {filename}: {e}")

@bot.command()
async def test(ctx):
    await ctx.send("Hello world!")

user_data = {}

if os.path.exists(LEVEL_FILE):
    with open(LEVEL_FILE, "r") as f:
        user_data = json.load(f)
else:
    user_data = {}

def save_levels():
    with open(LEVEL_FILE, "w") as f:
        json.dump(user_data, f, indent=4)

def check_level_up(user_id):
    leveled_up = False
    while user_data[user_id]["xp"] >= user_data[user_id][
            "required_xp"]:  #If XP passes current level
        user_data[user_id]["xp"] -= user_data[user_id]["required_xp"]
        user_data[user_id]["level"] += 1
        user_data[user_id]["required_xp"] = int(
            user_data[user_id]["required_xp"] * 1.2)
        leveled_up = True
    return leveled_up


@bot.event
async def on_message(message):
    
    if message.author.bot:
        return

    user_id = str(message.author.id)

    if user_id not in user_data:
        user_data[user_id] = {"xp": 0, "level": 0, "required_xp": 100}

    user_data[user_id]["xp"] += 10  # Amount per message

    if check_level_up(user_id):
        await message.channel.send(f"Congrats {message.author.mention}, you leveled up to **Level {user_data[user_id]['level']}!**")

    save_levels()

    await bot.process_commands(message)


@bot.command()
async def rank(ctx, member: discord.Member = None):
    if member is None:
      member = ctx.author
  
    user_id = str(member.id)

    if user_id in user_data:
        xp = user_data[user_id]["xp"]
        level = user_data[user_id]["level"]
        req_xp = user_data[user_id]["required_xp"]

        await ctx.send(
            f"{member.mention} is **Level {level}**, **{xp} / {req_xp} XP**")
    else:
        await ctx.send(f"{member.mention}, you have no XP yet.")

async def say(ctx, *, message: str):
await ctx.send(message)

async def lb(ctx):
    top_users = sorted(user_data.items(),
                       key=lambda x: (x[1]["level"], x[1]["xp"]),
                       reverse=True)[:10]

    leaderboard_message = ""

    for i, (user_id, data) in enumerate(top_users, start=1):

        member = await ctx.guild.fetch_member(str(user_id))
        name = member.display_name
        req_xp = user_data[user_id]["required_xp"]

        leaderboard_message += f"{i}. `{name}` Level {data['level']} - {data['xp']} XP / {req_xp} XP \n"

await ctx.send(leaderboard_message)

@bot.command()
async def ban(ctx, member: discord.Member = None, *, reason = "No reason provided"):
    if not ctx.author.guild_permissions.ban_members:
        await ctx.send("You don't have premission to ban members")
        return
        
    if member is None:
        await ctx.send("Missing member `mb!ban [@member] [reason(optional)]`")
        return
    
    await member.ban(reason=reason)
    try:
        await ctx.send(f"{member.mention} is banned, Reason: {reason}")
    except discord.Forbidden:
        await ctx.send("Cannot ban member, access denied")

@bot.command()
async def kick(ctx, member: discord.Member = None, *, reason = "No reason provided"):
    if not ctx.author.guild_permissions.kick_members:
        await ctx.send("You don't have premission to kick members")
        return
        
    if member is None:
        await ctx.send("Missing member `mb!kick [@member] [reason(optional)]`")
        return
    
    await member.kick(reason=reason)
    try:
        await ctx.send(f"{member.mention} is kicked, Reason: {reason}")
    except discord.Forbidden:
        await ctx.send("Cannot kick member, access denied")

@bot.command()
async def mute(ctx, member: discord.Member = None, duration: str = "None", *, reason = "No reason provided"):
    if member is None or duration is None:
        await ctx.send("Missing member or duration `mb!mute [@member] [duration(s)] [reason(Optional]`")
        return

    time = {"s": 1, "m": 60, "h": 3600, "d": 86400}

    try:
        amount = int(duration[:-1])
        unit = duration[-1]
        seconds = amount * time[unit]
    except (ValueError, KeyError):
        await ctx.send("Use correct format, `s/m/h/d Eg. 5s, 10m, 15h, 25d`")
        return

    try:
        await member.timeout(timedelta(seconds=seconds), reason=reason)
        await ctx.send(f"{member.mention} has been muted for {duration}, Reason: {reason}")
    except discord.Forbidden:
        await ctx.send("Cannot mute member, access denied")

def save_balance():
    with open("balance.json", "r") as f:
        json.dump("balance.json", f, indent=4)

@bot.command()
    async def bal(ctx, member: discord.Member = None):
        member = member or ctx.author
        user_id = str(member.id)

        if not os.path.exists(BALANCE_FILE):
            with open(BALANCE_FILE, "w") as f:
                json.dump({}, f)

        with open(BALANCE_FILE, "r") as f:
            balance = json.load(f)

        coins = balance.get(user_id, {}).get("coin", 0)
        fragments = balance.get(user_id, {}).get("fragments", 0)
        quartz = balance.get(user_id, {}).get("quartz", 0)

        await ctx.send(f"{member.mention} Coins: {coins}, Fragments: {fragments}, Quartz: {quartz}")

@bot.command()
    async def givecoin(ctx, member: discord.Member, amount: int):
        user_id = str(ctx.author.id)
        receiver = str(member.id)

        if not user_id or not amount:
            await ctx.send("Missing member or amount `mb!givecoin [@mention] [amount]`")
            return

        if not os.path.exists(BALANCE_FILE):
            with open(BALANCE_FILE, "w") as f:
                json.dump({}, f)

        with open(BALANCE_FILE, "r") as f:
            balance = json.load(f)

        if user_id not in balance:
            balance[user_id] = {}
        if "coin" not in balance[user_id]:
            balance[user_id]["coin"] = 0
        if receiver not in balance:
            balance[receiver] = {}
        if "coin" not in balance[receiver]:
            balance[receiver]["coin"] = 0

        balance[receiver]["coin"] += amount

        with open(BALANCE_FILE, "w") as f:
            json.dump(balance, f, indent=4)

        await ctx.send(f"Gave {amount} Coins to {member.mention}")

bot.run(os.environ["TOKEN"])
