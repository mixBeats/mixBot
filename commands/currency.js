const storage = require('node-persist');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

async function ensureStorage() {
  if (!storage.isInitialized) {
    await storage.init({ dir: DATA_DIR, forgiveParseErrors: true });
    storage.isInitialized = true;
  }
}

const balanceCommand = {
  name: 'bal',
  description: 'Check your balance',
  async execute(message) {
    await ensureStorage();
    const userId = message.author.id;

    let data = await storage.getItem(userId);
    if (!data || typeof data.coins !== 'number') {
      data = {
        userId, coins: 0 
      };
      await storage.setItem(userId, data);
    }

    await message.channel.send(`${message.author.username} Coins: **${data.coins}**`);
  },
};

const addCoinsCommand = {
  name: 'add-coins',
  description: 'Add coins to user',
  async execute(message, args) {
    await ensureStorage();
    if (!message.member.permissions.has('Administrator')) return message.reply('❌ You do not have permission to run this command');

    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);
    if (!targetUser || isNaN(amount)) return message.reply('Use: `mb!add-coins @user amount`');

    const userId = targetUser.id;
    let data = await storage.getItem(userId);
    if (!data || typeof data.coins !== 'number') data = {
      userId, coins: 0 
    };

    data.coins += amount;
    await storage.setItem(userId, data);

    await message.channel.send(`Added **${amount}** coins to <@${userId}>`);
  },
};

const currencyLeaderboard = {
  name: 'top',
  description: 'Top leaderboard for currency',
  async execute(message, args, client) {
    await ensureStorage();
    const data = await storage.values();

    if (!data.length) return message.channel.send("No users found in the database yet!");
    const users = data
      .map(entry => ({ userId: entry.userId, coins: entry.coins || 0 }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10);

    let leaderboard = "**mixBeats currency leaderboard**\n";
    for (let i = 0; i < users.length; i++) {
      const user = await client.users.fetch(users[i].userId).catch(() => null);
      const name = user ? user.username : "Unknown User";
      leaderboard += `${i + 1}. ${name} - Coins: ${users[i].coins}\n`;
    }

    message.channel.send(leaderboard);
  },
};

module.exports = [balanceCommand, addCoinsCommand, currencyLeaderboard];
