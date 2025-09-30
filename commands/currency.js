const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const DATA_FILE = path.join("/data", "levels.json");

const adapter = new JSONFile(DATA_FILE);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= { users: {} };
  await db.write();
}
initDB();

// Balance Command
const balanceCommand = {
  name: "bal",
  description: "Check your balance",
  async execute(message) {
    await db.read();
    const userId = message.author.id;

    db.data.users[userId] ||= { coins: 0, xp: 0, level: 1 };
    await db.write();

    const coins = db.data.users[userId].coins;
    await message.channel.send(`${message.author.username} Coins: **${coins}**`);
  }
};

const addCoinsCommand = {
  name: "add-coins",
  description: "Add coins to user",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You do not have permission to run this command");
    }

    const selectedUser = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!selectedUser || isNaN(amount)) {
      return message.reply("Use: mb!add-coins @member Amount");
    }

    await db.read();
    const userId = selectedUser.id;

    db.data.users[userId] ||= { coins: 0, xp: 0, level: 1 };
    db.data.users[userId].coins += amount;
    await db.write();

    await message.channel.send(`Added **${amount}** coins to <@${userId}>`);
  }
};

module.exports = [balanceCommand, addCoinsCommand];
