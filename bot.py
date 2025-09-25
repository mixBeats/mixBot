import discord
from discord.ext import commands
from cogs.currency import Currency

bot = commands.Bot(command_prefix="mb!", intents=discord.Intents.default())

bot.add_cog(Currency(bot))

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")
    print("Commands:", [cmd.name for cmd in bot.commands])

bot.run("YOUR_TOKEN")
