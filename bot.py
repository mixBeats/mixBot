import discord
from discord.ext import commands
import os
import json
intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="mb!", intents=intents)

LEVEL_FILE = "/data/levels.json"

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')
    print("Bot is online!")

@bot.command()
async def test(ctx):
    await ctx.send("Hello world!")

user_data = {}

# old os.path code goes here

if os.path.isdir(LEVEL_FILE):
    shutil.rmtree(LEVEL_FILE)
    print("Fixed: Removed directory that should be a file.")

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


@bot.command()
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
async def ban(ctx, member: discord.Member, *, reason = "No reason provided"):
    if not ctx.author.guild_premission.ban_members:
        await ctx.send("You don't have premission to ban members")
    if not member:
        await ctx.send("Missing member `mb!ban {member} {reason(optional)}`")
        return
    
    await member.ban(reason=reason)
    await ctx.send(f"{member.mention} is banned, Reason: {reason}")

bot.run(os.environ["TOKEN"])
