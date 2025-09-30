const storage = require('node-persist');

// Initialize storage (use Northflank volume if available)
const DATA_DIR = process.env.DATA_DIR || './data';
storage.init({ dir: DATA_DIR, forgiveParseErrors: true });

// ---------------- Balance Command ----------------
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

// ---------------- Add Coins Command ----------------
const addCoinsCommand = {
  name: 'add-coins',
  description: 'Add coins to user',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ You do not have permission.');
    }

    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!targetUser || isNaN(amount) || amount <= 0) {
      return message.reply('Usage: `!add-coins @user amount`');
    }

    const userId = targetUser.id;

    let coins = await storage.getItem(userId);
    if (coins === undefined || isNaN(coins)) coins = 0;

    coins += amount;

    await storage.setItem(userId, coins);

    await message.channel.send(
      `Added **${amount}** coins to <@${userId}>. New balance: **${coins}**`
    );
  },
};

module.exports = [balanceCommand, addCoinsCommand];
