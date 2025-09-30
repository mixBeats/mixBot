const fs = require("fs");
const path = require("path");

// Path to JSON file (use /data for Northflank volume)
const DATA_FILE = path.join("/data", "levels.json");

// --- Helpers ---
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- Balance Command ---
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

    await message.channel.send(
      `${message.author.username} Coins: **${data[userId].coins}**`
    );
  }
};

// --- Add Coins Command ---
const addCoinsCommand = {
  name: "add-coins",
  description: "Add coins to user",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You do not have permission.");
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!target || isNaN(amount)) {
      return message.reply("Usage: `!add-coins @member amount`");
    }

    const data = loadData();
    const userId = target.id;

    if (!data[userId]) {
      data[userId] = { coins: 0, xp: 0, level: 1 };
    }

    data[userId].coins += amount;
    saveData(data);

    await message.channel.send(
      `Added **${amount}** coins to <@${userId}>. New Balance: **${data[userId].coins}**`
    );
  }
};

module.exports = [balanceCommand, addCoinsCommand];
