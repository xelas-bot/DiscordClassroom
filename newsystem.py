import discord
from discord.ext import commands
import shlex
import json

with open('auth.json') as f:
    auth = json.load(f)
with open('config.json') as f:
    config = json.load(f)

bot = commands.Bot(command_prefix=config['prefix'], case_insensitive=True)

@bot.event
async def on_ready():
    print('Bot has logged in')

@commands.guild_only()
@bot.command()
async def ping(ctx):
    await ctx.send('pong')

@commands.guild_only()
@bot.command()
async def start(ctx):
    if ctx.message.author.roles[1].name == 'Teacher':
        await ctx.send('Welcome %s, you are a teacher.' % ctx.message.author)
    else:
        await ctx.send('Welcome %s, you are a student.' % ctx.message.author)

        

bot.run(auth['discord_key'])