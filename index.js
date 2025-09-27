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
const DATA_FILE = "/data/levels.json";

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

  if (!userData[userId]) userData[userId] = 
  { 
    xp: 0, level: 1 , username: message.author.username
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
      let member = message.guild.members.fetch(userId)
      .then(member => {
          const username = member.user.username;
            leaderboardMessage += `${i}. ${username} - Level **${data.level}** XP **${data.xp} / ${data.level * 150}**\n`;
      })
      .catch(() => {
          const username = data.username || `Unknown User (${userId})`;
            leaderboardMessage += `${i}. Unknown User ${userId} - Level **${data.level}** XP **${data.xp} / ${data.level * 150}**\n`;
      });
      
      const neededXp = userData[userId].level * 150;
    }
    message.channel.send(leaderboardMessage);
  }
});

client.login(process.env.TOKEN);
