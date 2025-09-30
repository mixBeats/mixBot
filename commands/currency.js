const fs = require("fs");
const path = require("path");

const DATA_FILE = "/data/levels.json";

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to save data:", err);
  }
}

// Balance Command
const balanceCommand = {
  name: "bal",
  description: "Check your balance",
  async execute(message) {
    const data = loadData();
    const userId = message.author.id;

    if (!data[userId]) {
      data[userId] = { coins: 0, xp: 0, level: 1 };
      saveData(data);
    }

    const coins = data[userId].coins ?? 0;

    await message.channel.send(`${message.author.username} Coins: **${coins}**`);
  }
};

// Add Coins Command
const addCoinsCommand = {
  name: "add-coins",
  description: "Add coins to user",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You do not have permission to run this command");
    }

    const data = loadData();
    const selectedUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!selectedUser || isNaN(amount)) {
      return message.reply("Use: mb!add-coins @member Amount");
    }

    const userId = selectedUser.id;

    data[userId] ??= { coins: 0, xp: 0, level: 1 };

    data[userId].coins = (data[userId].coins ?? 0) + amount;

    saveData(data);

    await message.channel.send(`Added **${amount}** coins to <@${userId}>`);
  }
};

module.exports = [balanceCommand, addCoinsCommand];
