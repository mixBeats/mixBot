const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
const prefix = "mb!";

const DATA_FILE = "/data/levels.json";

client.commands = new Map();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const commands = require(`./commands/${file}`);
    if (Array.isArray(commands)) {
        for (const cmd of commands) client.commands.set(cmd.name, cmd);
    } else {
        client.commands.set(commands.name, commands);
    }
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

let userData;
try {
  userData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
} catch (err) {
  console.error("Failed to parse Levels.json, initializing empty object.");
  userData = {};
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  
  if (command) {
    try {
      await command.execute(message, args, client);
    } catch (err) {
      message.reply("Cannot run this command");
    }
  }
  
  if (!message.author || message.author.bot) return;

  const userId = message.author.id;

  if (!userData[userId]) userData[userId] = 
  { 
    coins: 0, xp: 0, level: 1 , username: message.author.username
  };

  userData[userId].username = message.author.username;

  userData[userId].xp += 10;

  const neededXp = userData[userId].level * 150;
  if (userData[userId].xp >= neededXp) {
    userData[userId].level++;
    userData[userId].xp = 0;
    message.channel.send(`${message.author.username} leveled up to **Level ${userData[userId].level}**! 🎉`);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(userData, null, 2));

  // Commands
  if (message.content === prefix + "hello") message.channel.send("Hello!");

  if (message.content === prefix + "rank") {
    const data = userData[userId];
    message.channel.send(`${message.author.username} Level **${data.level}** XP **${data.xp}**`);
  }

  if(message.content === prefix + "lb"){
    const leaderBoardArray = Object.entries(userData);

    leaderBoardArray.sort((a, b) => {
      if(b[1].level === a[1].level){
        return b[1].xp - a[1].xp;
      }
      return b[1].level - a[1].level;
    });

    const topUsers = leaderBoardArray.slice(0, 10);

    let leaderboardMessage = "**mixBeats Leaderboard** \n";
    for(let i = 0; i < topUsers.length; i++){
      const [userId, data] = topUsers[i];
      let username;
      try {
                const member = await message.guild.members.fetch(userId);
                username = member.user.username;
            } catch {
                username = data.username || `Unknown User (${userId})`;
            }      
      const neededXp = userData[userId].level * 150;
      leaderboardMessage += `${i}. ${username} - Level **${data.level}** XP **${data.xp} / ${data.level * 150}**\n`;
    }
    message.channel.send(leaderboardMessage);
  }
});

client.login(process.env.TOKEN);
