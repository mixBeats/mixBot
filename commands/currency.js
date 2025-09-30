const fs = require("fs");
const path = require("path");

// ✅ Use Northflank volume if available, otherwise fallback to local "data"
const DATA_DIR = process.env.DATA_DIR || "/data";
const DATA_FILE = path.join(DATA_DIR, "levels.json");

// Make sure folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Make sure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  console.log("📂 Created new levels.json file at", DATA_FILE);
}

// Load JSON safely
function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Error loading data:", err);
    return {};
  }
}

// Save JSON safely
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log("✅ Saved data:", data);
  } catch (err) {
    console.error("❌ Error saving data:", err);
  }
}

// Ensure user data exists
function getUserData(data, userId) {
  if (!data[userId]) {
    data[userId] = { coins: 0, xp: 0, level: 1 };
    console.log(`ℹ️ New user entry created for ${userId}`);
  }
  return data[userId];
}

// Balance Command
const balanceCommand = {
  name: "bal",
  description: "Check your balance",
  async execute(message) {
    const data = loadData();
    const userId = message.author.id;

    const userData = getUserData(data, userId);

    console.log(`💰 Balance check for ${userId}:`, userData);

    await message.channel.send(`${message.author.username} Coins: **${userData.coins}**`);
  }
};

// Add Coins Command
const addCoinsCommand = {
  name: "add-coins",
  description: "Add coins to user",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You do not have permission to run this command.");
    }

    const selectedUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!selectedUser || isNaN(amount) || amount <= 0) {
      return message.reply("Usage: `!add-coins @member amount`");
    }

    const data = loadData();
    const userId = selectedUser.id;

    const userData = getUserData(data, userId);

    console.log(`➕ Before add: ${userId}`, userData);

    userData.coins = (userData.coins || 0) + amount;

    console.log(`✅ After add: ${userId}`, userData);

    saveData(data);

    await message.channel.send(`Added **${amount}** coins to <@${userId}>`);
  }
};

module.exports = [balanceCommand, addCoinsCommand];
