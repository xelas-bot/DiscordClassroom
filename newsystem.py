import discord
from discord.ext import commands
from discord.utils import get
import shlex
import json
import numpy
import matplotlib.pyplot as plt

'''
Utility Methods
'''
def read(filename):
    with open(filename) as f:
        data = json.load(f)
        f.close()
        return data
def write(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f)
        f.close()

'''
Bot Necessities
'''
auth = read('./auth.json')
config = read('./config.json')
users = read('./users.json')

bot = commands.Bot(command_prefix=config['prefix'], case_insensitive=True)


def has_role(user, role):
    return any(r.name == role for r in user.roles)
def get_role(guild, name):
    return discord.utils.get(guild.roles, name=name)
def id_to_ping(id):
    return '<@!' + str(id) + '>'
def ping_to_id(ping):
    return ping[3:-1]
def get_member(guild, id):
    return guild.get_member(int(id))

@bot.event
async def on_ready():
    print('Bot has logged in')


@bot.event
async def on_guild_join(guild):
    print("Hello " + guild.owner.name)

    try:
        if not any(x.name == 'Teacher' for x in guild.roles):
            await guild.create_role(name='Teacher', colour=discord.Colour(0xffffff))
        if not any(x.name == 'Student' for x in guild.roles):
            await guild.create_role(name='Student', colour=discord.Colour(0xffffff))
    except Exception:
        guild.owner.send("The bot does not have permissions to create/edit roles")
        
        
    if (guild.owner.id not in users['teachers']):
            users['teachers'].append(guild.owner.id)
            write(users, 'users.json')
                
    role = discord.utils.get(guild.roles, name="Teacher")
    
    await guild.owner.add_roles(role)

@bot.event
async def on_member_join(member):
    if config['auto_assign']:
        await member.add_roles(get_role(member.guild, "Student"))

@commands.guild_only()
@bot.command()
async def ping(ctx):
    await ctx.send('pong')

@commands.guild_only()
@bot.command()
async def teams(ctx, groups):
    if has_role(ctx.author, 'Teacher'):

        if groups == 'clear':
            for x in ctx.guild.roles:
                if "Group" in x.name :
                    await x.delete()
            for x in ctx.guild.categories:
                if 'Group' in x.name :
                    for y in x.text_channels:
                        await y.delete()
                    for y in x.voice_channels:
                        await y.delete()
                    await x.delete()

        else:
            roles = []
            for x in range(int(groups)):
                roles.append(await ctx.guild.create_role(name="Group " + str(x+1), hoist=True))
                overwrites = {ctx.guild.default_role: discord.PermissionOverwrite(read_messages=False), roles[x]:discord.PermissionOverwrite(read_messages=True)}
                category = await ctx.guild.create_category("Group " + str(x+1), overwrites=overwrites, position=(x+1))
                await category.create_text_channel("Group " + str(x+1))
                await category.create_voice_channel("Group " + str(x+1))
            
            incr = 0
            students = len(users['students'])
            while incr <= students:
                user = get_member(ctx.guild, users['students'][incr])
                role = roles[incr % int(groups)]
                await user.add_roles(role)
                incr += 1

'''
@bot.command(name = 'summon')
@commands.has_permissions(manage_guild = True)
async def summon(self, ctx: commands.context, *, channel: discord.VoiceChannel = None):
    if not channel and not ctx.author.voice:
            raise VoiceError('You are not in a channel')
    destination = channel or ctx.author.voice.channel
    if ctx.voice_state.voice:
        await ctx.voice_state.voice.move_to(destination)
        return
    ctx.voice_state.voice = await destination.connect()
    

@bot.command(name = 'leave', aliases=['disconnect'])
@commands.has_permissions(manage_guild=True)
async def leave(self, ctx: command.Context):
    if not ctx.voice_state.voice:
        return await ctx.send("Not in a channel")
'''
@commands.guild_only()
@bot.command()
async def start(ctx):
    if ctx.message.author.roles[1].name == 'Teacher':
        await ctx.send('Welcome %s, you are a teacher.' % ctx.message.author)
    else:
        await ctx.send('Welcome %s, you are a student.' % ctx.message.author)



@commands.guild_only()
@bot.command()
async def join_vc(ctx):
    channel = ctx.author.voice.channel
    await channel.connect()

@commands.guild_only()
@bot.command()
async def leave_vc(ctx):
    for v in bot.voice_clients:
        if v.guild == ctx.guild:
            await v.disconnect()


@commands.guild_only()
@bot.command()
async def assign(ctx, role, *member):
    if(len(member)>0):
        if(member[0].lower() == 'all'):
            for user in ctx.guild.members:
                if not has_role(user, role) and not has_role(user, 'Teacher') and not user.bot:
                    await user.add_roles(get_role(ctx.guild, role))
        else:
            for m in member:
                m = get_member(ctx.guild,ping_to_id(m))
                if not has_role(m, role):
                    await m.add_roles(get_role(ctx.guild, role))

@bot.command()
async def show_graph(ctx):
    attachment = ctx.message.attachments
    print(attachment)
    if attachment[0].url.endswith('csv'):
        print('CSV found')
    pass

bot.run(auth['discord_key'])