from discord.ext import commands

class Currency(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        print("Currency cog loaded")  # debug print to confirm cog loads

    @commands.command()
    async def hello(self, ctx):
        await ctx.send(f"Hello {ctx.author.display_name}! ")

async def setup(bot):
    await bot.add_cog(Currency(bot))
