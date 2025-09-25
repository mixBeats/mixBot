import discord
from discord.ext import commands

class Currency(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    print("Test cog")

    @commands.command()
    async def hello(self, ctx):
        await ctx.send("Hello!")

async def setup(bot):
    await bot.add_cog(Currency(bot))
