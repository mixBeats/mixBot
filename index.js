const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { db } = require('./firebase');

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

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const commands = require(path.join(commandsPath, file));

    if (Array.isArray(commands)) {
      for (const cmd of commands) {
        if (cmd.name) client.commands.set(cmd.name, cmd);
        else console.warn(`Skipping invalid command in ${file}`);
      }
    } else if (commands.name) {
      client.commands.set(commands.name, commands);
    } else {
      console.warn(`Skipping invalid command file: ${file}`);
    }
  }
} else {
  console.warn("Commands folder not found!");
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

client.userData = userData;
client.db = db;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const userId = message.author.id;

  if (!userData[userId]) userData[userId] = { coins: 0, xp: 0, level: 1, username: message.author.username, items: [] };
  userData[userId].username = message.author.username;

  try {
    const command = client.commands.get(commandName);
    if (command) await command.execute(message, args, client);

    if (commandName === "test") {
      return message.channel.send("Test");
    }

    if (commandName === "rank") {
      const data = userData[userId];
      if (!data) return message.channel.send("You have no data yet!");

      const sorted = Object.entries(userData).sort((a, b) => {
        if (b[1].level === a[1].level) return b[1].xp - a[1].xp;
        return b[1].level - a[1].level;
      });

      const author_rank = sorted.findIndex(([id]) => id === userId);
      return message.channel.send(`${message.author.username} Level **${data.level}** XP **${data.xp}** Rank: **#${author_rank + 1}**`);
    }

    if (commandName === "lb") {
      const leaderBoardArray = Object.entries(userData)
        .sort((a, b) => b[1].level - a[1].level || b[1].xp - a[1].xp)
        .slice(0, 10);

      let leaderboardMessage = "**mixBeats Leaderboard**\n";
      for (let i = 0; i < leaderBoardArray.length; i++) {
        const [id, data] = leaderBoardArray[i];
        let username;
        try {
          const member = await message.guild.members.fetch(id);
          username = member.user.username;
        } catch {
          username = data.username || `Unknown User (${id})`;
        }
        leaderboardMessage += `${i + 1}. ${username} - Level **${data.level}** XP **${data.xp} / ${data.level * 150}**\n`;
      }
      return message.channel.send(leaderboardMessage);
    }

    userData[userId].xp += 10;
    const neededXp = userData[userId].level * 150;
    if (userData[userId].xp >= neededXp) {
      userData[userId].level++;
      userData[userId].xp = 0;
      message.channel.send(`<@${message.author.id}> leveled up to **Level ${userData[userId].level}**! 🎉`);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(userData, null, 2));
    
  } catch (err) {
    console.error(`Error in messageCreate:`, err);
    message.reply("There was an error processing your command.");
  }
});

client.login(process.env.TOKEN);
