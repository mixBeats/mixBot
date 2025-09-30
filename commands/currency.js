const fs = require("fs");
const path = require("path");

const PERSISTENT_MOUNT_PATH = "/data"; 
const DATA_DIR = PERSISTENT_MOUNT_PATH;
const DATA_FILE = path.join(DATA_DIR, "levels.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

function loadData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.error(`[LOAD ERROR] Failed to load data from ${DATA_FILE}`);
        return {}; 
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`[SAVE ERROR] CRITICAL: Failed to save data to ${DATA_FILE}`);
    }
}

function getUserData(data, userId) {
    if (!data[userId]) {
        data[userId] = { coins: 0, xp: 0, level: 1 };
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
        const coins = userData.coins;

        await message.channel.send(`${message.author.username} coins: **${coins}**`);
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
            return message.reply("Use: `!add-coins @member amount`");
        }

        const data = loadData();
        const userId = selectedUser.id;

        const userData = getUserData(data, userId); 

        userData.coins += amount;
         
        saveData(data);

        await message.channel.send(`✅ Added **${amount}** coins to <@${userId}>`);
    }
};

module.exports = [balanceCommand, addCoinsCommand];
