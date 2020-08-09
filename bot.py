import discord
from discord.ext import commands
import shlex
import json
import pynacl

def read(filename):
    with open(filename) as f:
        data = json.load(f)
        f.close()
        return data

def write(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f)
        f.close()
    

auth = read('auth.json') # Opening Authentication File
users = read('users.json')# Opening Teacher list File

client = discord.Client()
prefix = "!" # Prefix (can be changed to anything*)

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
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


async def join(ctx):
    channel = ctx.author.voice.channel
    await channel.connect()

async def leave(ctx):
    await ctx.voice_client.disconnect()


@client.event
async def on_member_join():
    print("MEMBER JOIN")



@client.event
async def on_message(message):
    print(message.content)
    # Only accept commands
    if message.author == client.user or message.content[0] != prefix:
        return
    
    # Get !command [args]
    try:
        args = shlex.split(message.content)
        print(args)
    except Exception:
        print('There was an error')
        return
    
    command = args[0][1:]
    del args[0]

    ''' TEST COMMANDS '''
    if command == 'rejoin':
        await on_guild_join(message.guild)

    ''' COMMANDS '''
    if command == "ping":
        await message.channel.send('pong <@' + str(message.author.id) + ">")

    if command == "sh" :
        msg = 'caleb is obese'
        if len(args) == 0:
            await message.channel.send("Tag someone!")
        else:
            user = client.get_user(int(args[0][3:-1]))
            await user.send(msg)
    
    if command == "join":
        await join(message)
        
    if command == "start": # Still need to add method to check if user is already started or not
        if (message.author.id not in users['teachers']):
            users['teachers'].append(message.author.id)
            with open('users.json', 'w') as f:
                json.dump(users, f)
        
        
        if (message.author.roles[1].name == 'Teacher'):

            
            
            
            if (Student_Exists):
                await message.channel.send("Welcome " + message.author.name + ", you are a teacher.")
            else:
                await guild.create_role(name='Student', colour=discord.Colour(0xffffff))
                await message.channel.send("Welcome " + message.author.name + ", you are a teacher.")


    if True and command=='teams': #command to split students into groups with their own private channels
        if (message.author.roles[1].name == 'Teacher'):
            for x in range(int(args[0])):
                await guild.create_role(name="Group " + str(x+1))
            count = 1
            students = len(users['students'])
            for x in users['students']:
                user = fetch_user(int(x))
                role = discord.utils.get(guild.roles, name="Group " + str(count))
                if (count/)






                pass
    
    if command == 'assign':
        if(args[1] == 'all'):
            for member in guild.members:
                
                for role in member.roles:
                    if(role.name=='Student'):
                        pass
            


client.run(auth['discord_key'])