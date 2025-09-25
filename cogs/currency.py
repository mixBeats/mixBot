from discord.ext import commands

class Currency(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        print("Running cog")

    @commands.command()
    async def hello(self, ctx):
        await ctx.send("Hello!")
