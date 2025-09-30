const fs = require("fs");
const path = require("path");


const PERSISTENT_MOUNT_PATH = "/data"; 
const DATA_DIR = PERSISTENT_MOUNT_PATH;
const DATA_FILE = path.join(DATA_DIR, "levels.json");

// Ensure the persistent directory exists before trying to write to it.
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`[SETUP] Created persistent directory: ${DATA_DIR}`);
}

// Ensure the data file exists with an empty object if it's the first run.
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
    console.log(`[SETUP] Created data file: ${DATA_FILE}`);
}

// --- Data Management Functions ---

function loadData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.error(`[LOAD ERROR] Failed to load data from ${DATA_FILE}: ${err.message}`);
        return {}; 
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        // console.log("Saved data successfully."); // Keep logging minimal in production
    } catch (err) {
        // This is a critical error, often indicates permission problems on Northflank volume.
        console.error(`[SAVE ERROR] CRITICAL: Failed to save data to ${DATA_FILE}: ${err.message}`);
    }
}

function getUserData(data, userId) {
    // 💡 IMPROVEMENT: Don't save the whole file just to initialize a user in /bal.
    // The calling command (add-coins) will handle the save. 
    if (!data[userId]) {
        data[userId] = { coins: 0, xp: 0, level: 1 };
        // Removed unnecessary saveData(data) from here
    }
    return data[userId];
}

// --- Commands ---

// Balance Command
const balanceCommand = {
    name: "bal",
    description: "Check your balance",
    async execute(message) {
        const data = loadData();
        const userId = message.author.id;

        const userData = getUserData(data, userId);
        const coins = userData.coins;

        await message.channel.send(`💰 **${message.author.username}** has **${coins}** coins.`);
    }
};

// Add Coins Command (Administrator Command)
const addCoinsCommand = {
    name: "add-coins",
    description: "Add coins to user",
    async execute(message, args) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ You do not have permission to run this command.");
        }

        const selectedUser = message.mentions.users.first();
        
        // 💡 Argument Parsing Fix: Use robust method to find the amount (index 1 is common, but may vary)
        const amount = parseInt(args[1], 10);

        if (!selectedUser || isNaN(amount) || amount <= 0) {
            return message.reply("📝 Use: `!add-coins @member <amount>` (Amount must be a positive number).");
        }

        const data = loadData();
        const userId = selectedUser.id;

        const userData = getUserData(data, userId); 

        // Update the balance
        userData.coins += amount;
         
        // Save the entire data object
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        await message.channel.send(`✅ Added **${amount}** coins to <@${userId}>. New balance: **${userData.coins}**.`);
    }
};

module.exports = [balanceCommand, addCoinsCommand];
