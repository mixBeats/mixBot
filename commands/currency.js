const storage = require('node-persist');

const DATA_DIR = '/data';
storage.init({ dir: DATA_DIR, forgiveParseErrors: true });

// Balance Command
const balanceCommand = {
  name: 'bal',
  description: 'Check your balance',
  async execute(message) {
    const userId = message.author.id;

    let coins = await storage.getItem(userId);
    if (coins === undefined || isNaN(coins)) coins = 0;

    await message.channel.send(`${message.author.username} Coins: **${coins}**`);
  },
};

// Add Coins Command
const addCoinsCommand = {
  name: 'add-coins',
  description: 'Add coins to user',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ You do not have premission to run this command');
    }

    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!targetUser || isNaN(amount)) {
      return message.reply('Use: `mb!add-coins @user amount`');
    }

    const userId = targetUser.id;

    let coins = await storage.getItem(userId);
    if (coins === undefined || isNaN(coins)) coins = 0;

    coins += amount;

    await storage.setItem(userId, coins);

    await message.channel.send(
      `Added **${amount}** coins to <@${userId}>`
    );
  },
};

const topCommand = {
  name: 'top',
  description: 'Top leaderboard for currency',
  async execute(message, args) {
    const data = await storage.values();

    const users = data.map(entry =>({
      userId: entry.userId,
      coins: entry.coins || 0
    }));

    users.sort((a, b) => b.coins - a.coins);

    const userList = users.slice(0, 10);

    let leaderboard = "**mixBeats currency leaderboard** \n";
    for(const i = 0; i<userList.length; i++){
      const user = await client.users.fetch(userList[i].userId).catch(() => null);
      const name = name ? user.username : "Unknown User";
      leaderboard += `${i}. ${name} - Coins: ${userList[i].coins} \n`;
    }

    message.channel.send(leaderboard || "No data yet");
    
  },
};

module.exports = [balanceCommand, addCoinsCommand, topCommand];
