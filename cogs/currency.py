from discord import app_commands, Interaction
from discord.ext import commands

class Currency(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="hello", description="Says hello")
    async def hello(self, interaction: Interaction):
        await interaction.response.send_message("Hello!")

async def setup(bot):
    await bot.add_cog(Currency(bot))
