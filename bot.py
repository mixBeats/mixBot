import discord
from discord.ext import commands
import os
import json
import shutil
from datetime import timedelta

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="mb!", intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')
    print("Bot is online!")

@bot.command()
async def say(ctx, *, message: str):
    await ctx.send("Test")

bot.run(os.environ["TOKEN"])








