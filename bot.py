import discord
import shlex


client = discord.Client()
prefix = "!"

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    try:
        if message.content[0] != prefix:
            return
    except Exception:
        return
    
    try:
        args = shlex.split(message.content)
        print(args)
    except Exception:
        print('someone is obese')
        return
    
    command = args[0][1:]
    del args[0]


    if command == "start": # Still need to add method to check if user is already started or not
        print(message.author.roles[1])
        if (str(message.author.roles[1]) == 'Teacher'):
            await message.channel.send("Welcome " + message.author.name + ", you are a teacher.")

        else:
            await message.channel.send("Welcome " + message.author.name + ", you are a student.")

    
    if True and command=='teams':
        if (str(message.author.roles[1]) == 'Teacher'):
            print(discord.__version__)
            guild = message.guild
            await guild.create_role(name="Group")

        
            


client.run('NzE1MzQwMzA2MTQ4NjIyNDk2.Xs7ykw.GGSom3ANbnqucJTYtJfMR0772bE')