const storage = require('node-persist');
const path = require('path');

const DATA_DIR = '/data';

async function ensureStorage() {
  if (!storage.isInitialized) {
    await storage.init({
      dir: DATA_DIR,
      forgiveParseErrors: true
    });
    storage.isInitialized = true;
  }
}

async function getUserData(userId) {
  await ensureStorage();
  let data = await storage.getItem(userId);
  if (!data || typeof data.coins !== 'number') {
    data = { userId, coins: 0 };
    await storage.setItem(userId, data);
  }
  return data;
}

const balanceCommand = {
  name: 'bal',
  description: 'Check your balance',
  async execute(message) {

    const userId = message.author.id;
    const name = await message.guild.members.fetch(userId);
    const data = await getUserData(userId);
    await message.channel.send(`${name.user.username} Coins: **${data.coins}**`);
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

    const data = await getUserData(targetUser.id);
    data.coins += amount;
    await storage.setItem(targetUser.id, data);

    await message.channel.send(`Added **${amount}** coins to <@${targetUser.id}>`);
  },
};

const removeCoinsCommand = {
  name: 'remove-coins',
  description: 'Remove coins from user',
  async execute(message, args) {
    await ensureStorage();
    if (!message.member.permissions.has('Administrator')) return message.reply('❌ You do not have permission to run this command');

    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);
    if (!targetUser || isNaN(amount)) return message.reply('Use: `mb!remove-coins @user amount`');

    const data = await getUserData(targetUser.id);
    data.coins -= amount;
    await storage.setItem(targetUser.id, data);

    await message.channel.send(`Removed **${amount}** coins from <@${targetUser.id}>`);
  },
};

const currencyLeaderboard = {
  name: 'top',
  description: 'Top leaderboard for currency',
  async execute(message, args, client) {
    await ensureStorage();
    let data = await storage.values();

    if (!data.length) return message.channel.send("No users found in the database yet!");

    const validUsers = [];
    for (const entry of data) {
      if (!entry || typeof entry.coins !== "number" || !entry.userId) {
        continue;
      }

      if (isNaN(entry.coins)) entry.coins = 0;

      await storage.setItem(entry.userId, entry);

      validUsers.push(entry);
    }

    if (!validUsers.length) return message.channel.send("No valid users found in the database yet!");

    const users = validUsers
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10);

    let leaderboard = "**mixBeats currency leaderboard**\n";
    for (let i = 0; i < users.length; i++) {
      const entry = users[i];
      let userName = "Unknown User";
      try {
        const user = await client.users.fetch(entry.userId);
        if (user) userName = user.username;
      } catch {}
      leaderboard += `${i + 1}. ${userName} - Coins: ${entry.coins}\n`;
    }

    return message.channel.send(leaderboard);
  },
};

const giveCommand = {
  name: 'give',
  description: 'Give an amount to a member',
  async execute(message, args) {
    await ensureStorage();
    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!targetUser || isNaN(amount)) return message.reply('Use: `mb!give @user amount`');
    if (targetUser.id === message.author.id) return message.reply("You cannot give coins to yourself");

    const authorData = await getUserData(message.author.id);
    if (authorData.coins < amount) return message.reply("❌ Not enough coins");

    const targetData = await getUserData(targetUser.id);

    authorData.coins -= amount;
    targetData.coins += amount;

    await storage.setItem(authorData.userId, authorData);
    await storage.setItem(targetData.userId, targetData);

    await message.channel.send(`Gave **${amount}** coins to <@${targetUser.id}>`);
  },
};

module.exports = [balanceCommand, addCoinsCommand, removeCoinsCommand, currencyLeaderboard, giveCommand];
