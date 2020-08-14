// Gets json for authentication with APIs
const auth = require('./auth.json');
const Discord = require('discord.js');

// Init APIs
const bot = new Discord.Client();
const csv = require('csvtojson')
var plotly = require('plotly')("shreyp941", "EVB3wx9ilEippMEXHPne")
var fs = require('fs');



function myData(filepath, name) {
    const csvFilePath = filepath


    if (filepath == "Test.csv") {

        dataset = [0, 0, 0, 0, 0, 0, 0, 0]
        var arr;
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                var keys = [];
                var table = jsonObj.slice(1, jsonObj.length)
                var testObj = jsonObj[0]

                values = []

                var x
                for (x in testObj) {

                    keys.push(testObj[x])
                }
                keys = keys.slice(0, keys.length - 1)

                for (x in testObj) {
                    values.push(x)
                }
                values = values.slice(0, values.length - 1)
                //console.log(table)
                var y
                var qnum = 0


                for (x in table) {
                    var qnum = 0
                    //console.log(table[x])

                    for (y in table[x]) {
                        delete table[x].Names
                        //console.log(table[x][qnum+1])
                        if (table[x][qnum + 1] != keys[qnum]) {
                            dataset[qnum] += 1;
                        }
                        qnum += 1
                    }
                }

                console.log(dataset)
                var newValues = values.map(Number)
                console.log(newValues)


                var trace1 = {
                    x: newValues,
                    y: dataset,
                    name: "Questions Missed",
                    type: "bar"
                };

                var layout = {
                    title: "Questions Missed on Recent Exam",
                    xaxis: {
                        title: "Question Number",
                        titlefont: {
                            family: "Courier New, monospace",
                            size: 10,
                            color: "#7f7f7f"
                        }
                    },
                    yaxis: {
                        title: "Amount of Students who Missed the Question",
                        titlefont: {
                            family: "Courier New, monospace",
                            size: 10,
                            color: "#7f7f7f"
                        }
                    }
                };

                var figure = { 'data': [trace1], layout: layout };

                var imgOpts = {
                    format: 'png',
                    width: 1000,
                    height: 500
                };

                plotly.getImage(figure, imgOpts, function (error, imageStream) {
                    if (error) return console.log(error);

                    var fileStream = fs.createWriteStream('temp_graph.png');
                    imageStream.pipe(fileStream);
                });


            })
    } else {
        user = name
        var name;
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                console.log(jsonObj);

                bulk = jsonObj
                Studentnames = []
                units = []
                dataset = []
                tempObj = {}


                for (x in bulk) {
                    Studentnames.push(bulk[x]["field1"])
                }
                console.log(Studentnames)

                for (x in bulk[0]) {
                    units.push(x)
                }
                units = units.slice(1, units.length)
                console.log(units)





                for (x in bulk) {
                    if (bulk[x]["field1"] == user) {
                        name = bulk[x]['field1']
                        for (y in bulk[x]) {
                            dataset.push(bulk[x][y])
                        }
                    }
                }
                dataset = dataset.slice(1, dataset.length)
                dataset = dataset.map(Number)
                console.log(dataset)


                var trace1 = {
                    x: units,
                    y: dataset,
                    type: "line"
                };
                var layout = {
                    title: "Score Progress for " + name,
                    xaxis: {
                        title: "Unit Number",
                        titlefont: {
                            family: "Courier New, monospace",
                            size: 10,
                            color: "#7f7f7f"
                        }
                    },
                    yaxis: {
                        title: "Unit Test Score",
                        titlefont: {
                            family: "Courier New, monospace",
                            size: 10,
                            color: "#7f7f7f"
                        }
                    }
                };

                var figure = { 'data': [trace1], layout: layout };

                var imgOpts = {
                    format: 'png',
                    width: 1000,
                    height: 500
                };

                plotly.getImage(figure, imgOpts, function (error, imageStream) {
                    if (error) return console.log(error);

                    var fileStream = fs.createWriteStream('temp_graph.png');
                    imageStream.pipe(fileStream);
                });

            })

    }

}



















// Import dlz_utils
const dlz_utils = require('./dlz_utils.js');

// Get configuration file
const config = require('./config.json');

// Authetication with discord
bot.login(auth.discord_key);
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online.`);
    // Set bot activity
    bot.user.setActivity(
        `@Chewie4k | ${prefix}help`
    ).then(
        presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`)
    ).catch(console.error);
});

// Prefix to communicate with bot
const prefix = config.prefix;

// Channel IDs 
const channel_ids = config.channel_ids;

// Commands- Key is command, value is help
const commands = require('./commands.json');
const { default: OsuAPI } = require('./OsuAPI');

var admin_role = config.roles.admin; //"674476313343557632";
var timeout = config.roles.timeout; //"686438951354892290";

var channels = [];



// Gets formats date in YYYY-MM-DD
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

// Bot responds to messages
bot.on('message', async message => {
    // Message Content
    var content = message.content;

    if (content.match(/.*tik.*tok.*/)) {
        console.log(`Tik Tok detected in message '${content}' from ${message.member}`);
    }

    // If it matches the prefix, treat is as commands
    if (content.substring(0, 1) == prefix) {

        // Gets arguments
        var args = content.substring(1).split(/\s+/);
        var cmd = args[0];

        console.log(`Executed ${cmd} with parameter(s): ${args}`);

        // Execute based on commands
        switch (cmd) {

            // Help command
            case 'help':

                // no arguments
                if (args.length < 2) {
                    var response = '';
                    var keys = Object.keys(commands);
                    for (var i = 0; i < keys.length; i++) {
                        response += keys[i] + '\n';
                    }
                    message.channel.send(`Valid commmands are:\n${response}`);
                } else { // get help for specific command
                    var keys = Object.keys(commands);
                    if (keys.includes(args[1])) {
                        message.channel.send(commands[args[1]]); // If command exists
                    } else {
                        message.channel.send('That command does not exist.'); // If command doesn't exist
                    }
                }
                break;
            // Roll command

            case 'roll':
                // 1 argument
                if (args.length < 3) {
                    message.channel.send(`Rolled: ${Math.trunc(Math.random() * parseInt(args[1])) + 1}`);
                }
                else { // More arguments
                    message.channel.send(`Rolled: ${Math.trunc(Math.random() * (parseInt(args[2]) - parseInt(args[1]) + 1)) + parseInt(args[1])}`);
                }
                break;
            // Check command
            case 'check': alpha.data.quote(args[1]).then(data => {
                // var today = formatDate(Date.now());
                console.log(data);
                data = data['Global Quote'];
                var response = '';
                var keys = Object.keys(data);
                for (var i = 0; i < keys.length; i++) {
                    response += `${keys[i].split('. ')[1]} : ${data[keys[i]]}\n`;
                }
                message.channel.send(response);
            }); break;

            // Poll in current channel
            case 'pollhere':
                var poll = content.match(/".+"/)[0].replace(/"/g, ''); // Gets poll question
                var poll_msg = await message.channel.send(poll); // Sends message
                var reactions = content.replace(/".+"/, '').split(/\s+/); // Gets arguments 
                for (var i = 1; i < reactions.length; i++) {
                    await poll_msg.react(reactions[i]); // Adds reactions
                }
                break;

            // Poll in poll channel
            case 'poll':
                var poll = content.match(/".+"/)[0].replace(/"/g, ''); // Gets poll question
                var poll_msg = await bot.channels.get(channel_ids['poll']).send(poll); // sends
                var reactions = content.replace(/".+"/, '').split(/\s+/); // gets arguemnts
                for (var i = 1; i < reactions.length; i++) {
                    await poll_msg.react(reactions[i]); // adds reaction
                }
                break;

            // Trim command
            case 'trim':
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    var amount = args[1]; // Argument passed for # of messages to delete
                    message.channel.bulkDelete(amount).then(() => { // Bulk deletes messages
                        message.channel.send(`Deleted ${amount} message(s)`); // Sends message that messages have been deleted
                    });
                } else {
                    message.channel.send('You do not have permissions to do this!');
                }
                break;


            case 'force_end_mafia':
                mafia_lib.force_end_mafia(message);
                break;

            // Mafia
            case 'mafia':
                mafia_lib.start_mafia(message, args);
                break;

            case 'display':
                
                const csvFilePath = 'unit progress.csv'



                if (args[1] == "recent_test") {
                    myData('Test.csv')
                    setTimeout(() => {  message.channel.send("Data for most recent test", { files: ["temp_graph.png"] }); }, 1000);
                    



                } else if (args[1] == "unit_scores") {

                    myData('unit progress.csv', args[2])
                    setTimeout(() => { message.channel.send("Displaying data for " + args[2], { files: ["temp_graph.png"] });  }, 1000);
                    
                }





            case 'id':
                message.channel.send(`@${message.member.user.tag}`);
                console.log(message.member.user.tag);
                break;

            case 'perms':
                console.log(message.channel.permissionsFor(message.member).serialize(false))
                break;

            case 'test':
                console.log(message.member.voiceChannel.parentID);
                break;

            case 'vc':
                if (message.member.roles.has(admin_role)) {
                    var channel_name = args[1];


                    await message.member.guild.createChannel(channel_name, {
                        type: 'voice',
                        parent: message.member.voiceChannel.parent,
                        userLimit: (args.length > 2) ? args[2] : 0
                    }).then(
                        async channel => {
                            channels.push({ newID: channel.id, guild: channel.guild });
                            await message.member.setVoiceChannel(channel.id);
                        }
                    );
                    message.channel.send(`Created new voice channel '${channel_name}'`);
                } else {
                    message.channel.send(`You don't have permissions to create voice channels.`);
                }
                break;
            case 'elim':
                var people = [];
                for (var i = 1; i < args.length; i++) {
                    people.push(args[i]);
                }
                while (people.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    dlz_utils.shuffle(people);
                    message.channel.send(`**${people[0]}** has been eliminated!`);
                    people.shift();
                }
                message.channel.send(`The winner is **${people[0]}**!`);
                console.log(people[0]);
                break;
            case 'pick':
                var people = [];
                for (var i = 1; i < args.length; i++) {
                    people.push(args[i]);
                }
                dlz_utils.shuffle(people);
                message.channel.send(`Selected **${people[0]}**`);
                console.log(people[0]);
                break;
            case 'mimic':
                var send_message = '';
                for (var v = 1; v < args.length; v++) {

                    send_message += args[v];
                    console.log(send_message);
                }
                message.channel.send(send_message);
                break;
            case 'poke':
                ///var poke = new Discord.MessageEmbed()
                //    .setColor('#05b077')
                //    .setDescription('**A wild pokemon has appeared!**\nGuess the pokémon аnd type .cаtch <pokémon> to\n cаtch it!')
                //    .setImage('./res/img/poke/rayquaza.png');
                //message.channel.send(poke);
                var pokemon = {
                    'Rayquaza': 'https://i.imgur.com/apuDXA9.png',
                    'Dialga': 'https://i.imgur.com/p4ariHV.png',
                    'Groudon': 'https://i.imgur.com/F49hmFs.png'
                }
                var selection = 'Dialga';
                message.channel.send({
                    "embed": {
                        "description": "**A wild pokemon has appeared!**\nGuess the pokémon аnd type .cаtch <pokémon> to\n cаtch it!",
                        "color": 2469763,
                        "image": {
                            "url": pokemon[selection]
                        }
                    }
                });
                // message.delete();
                const collector = new Discord.MessageCollector(message.channel, m => m.content.includes('.catch'));
                collector.on('collect', m => {
                    if (m.content.toLowerCase().includes(selection.toLowerCase())) {
                        message.channel.send(`Congratulations ${m.author}! You caught a level ${Math.floor(Math.random() * 50) + 1} ${selection}! Added to Pokédex.`);
                        collector.stop();
                    } else {
                        message.channel.send('This is the wrong pokémon!');
                    }
                });
                break;
            case 'osu':
                user = args[1];
                user_data = await osu.getUser(user);
                user_data = user_data[0];
                console.log(user_data);

                const top = await osu.getUserBest(user, 0, 5);
                console.log(top);

                const data = {
                    "title": `${user_data['username']} (Rank: #${user_data['pp_rank']})`,
                    "description": `Been playing since ${user_data['join_date']}.`,
                    "url": `https://osu.ppy.sh/u/${user_data['user_id']}`,
                    "color": 16731804,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.author.avatarURL,
                        "text": message.author.username
                    },
                    "thumbnail": {
                        "url": osu.getUserImageURL(user_data['user_id'])
                    },
                    "author": {
                        "name": 'osu!',
                        "url": 'https://osu.ppy.sh/',
                        "icon_url": 'https://upload.wikimedia.org/wikipedia/commons/4/44/Osu%21Logo_%282019%29.png'
                    },
                    "fields": [
                        {
                            "name": "Accuracy",
                            "value": `${user_data['accuracy'].substring(0, user_data['accuracy'].indexOf('.') + 3)}%`,
                            "inline": true
                        },
                        {
                            "name": "PP",
                            "value": `${user_data['pp_raw']}`,
                            "inline": true
                        },
                        {
                            "name": "Top Plays",
                            "value": `${top[0]['beatmap_id']}\tCombo: ${top[0]['maxcombo']}\tScore: ${top[0]['score']}\tRank: ${top[0]['rank']}`
                        }
                    ]
                };
                message.channel.send({ embed: data });

                break;
            // Handle invalid commands
            default: message.channel.send(`'${cmd}' is not a valid command.`); break;
        }
    }
});

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (channels.length >= 0) for (let i = 0; i < channels.length; i++) {
        let ch = channels[i].guild.channels.find(x => x.id == channels[i].newID);

        if (ch.members.size <= 0) {
            await ch.delete();

            return channels.splice(i, 1);
        }
    }
})
