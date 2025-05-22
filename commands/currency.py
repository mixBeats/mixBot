from discord.ext import commands
import discord

def cur(bot):

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
        reveicer = str(member.id)
    
        if not user_id or not amount:
            await ctx.send("Missing member or amount `mb!givecoin [@mention] [amount]`")
        
        with open(BALANCE_FILE, "r") as f:
            balance = json.load(f)
    
        if user_id not in balance:
            balance[user_id] = {}
        if "coin" not in balance[user_id]:
            balance[user_id]["coin"] = 0
    
        balance[reveicer]["coin"] += amount
    
        with open(BALANCE_FILE, "w") as f:
            json.dump(balance, f, indent=4)
    
        await ctx.send(f"Gave {amount} Coins to {member.mention}")
