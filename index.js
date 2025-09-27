const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefix = "mb!";
const fs = require('fs');

let userData = {};

if(fs.existsSync("/data/Levels.json")){
    userData = JSON.parse(fs.readFileSync("/data/Levels.json", "utf8"));
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (!message.author || message.author.bot) return;

    const userId = message.author.id;

    userData[userId] += 10;

    const neededXp = userData[userId].level * 150;
    if(userData[userId] >= neededXp){
        userData[userId].level++;
        userData[userId].xp += 0;
        message.channel.send(`${message.author.username} has leveled up to level **${userData[userId].level}**! 🎉🎉`);
    }

    fs.writeFileSync("/data/Levels.json", JSON.stringify(userData, null, 2));

    if (message.content === prefix + 'hello') {
        message.channel.send('Hello!');
    }

    if(message.content === prefix + 'rank'){

        const userId = message.author.id;
        if(!userData[userId]){
            userData[userId] = {
            xp: 0,
            level: 1
            };
        }
        const data = userData[userId];
        
        message.channel.send(`${message.author.username} Level **${data.level}** XP **${data.xp}**`);
    }
});

client.login(process.env.TOKEN);
