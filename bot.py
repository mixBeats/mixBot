import os
import discord
from discord.ext import commands
import asyncio
import os

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="mb!", intents=intents)

async def load_cogs():
    for filename in os.listdir("./cogs"):
        if filename.endswith(".py") and filename != "__init__.py":
            await bot.load_extension(f"cogs.{filename[:-3]}")

async def on_ready():
    print(f"Logged in as {bot.user}")
    print("Cogs loaded:", bot.cogs.keys())
    print("Commands loaded:", [cmd.name for cmd in bot.commands])

async def main():
    async with bot:
        await load_cogs()
        await bot.start(os.environ["TOKEN"])

asyncio.run(main())
