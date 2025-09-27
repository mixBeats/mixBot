const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "mb!";
const DATA_FILE = "/data/Levels.json"; // volume path

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

client.on('messageCreate', message => {
  if (!message.author || message.author.bot) return;

  const userId = message.author.id;

  if (!userData[userId]) userData[userId] = { xp: 0, level: 1 };

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
});

client.login(process.env.TOKEN);
