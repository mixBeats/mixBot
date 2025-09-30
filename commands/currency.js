const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
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
        console.error("Error loading data:", err);
        return {};
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log("Saved data successfully.");
    } catch (err) {
        console.error("Error saving data:", err);
    }
}

function getUserData(data, userId) {
    if (!data[userId]) {
        data[userId] = { coins: 0, xp: 0, level: 1 };
        saveData(data);
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

        await message.channel.send(`${message.author.username} Coins: **${coins}**`);
    }
};

const addCoinsCommand = {
    name: "add-coins",
    description: "Add coins to user",
    async execute(message, args) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ You do not have permission to run this command.");
        }

        const selectedUser = message.mentions.users.first();
        const amount = parseInt(args[1], 10);

        if (!selectedUser || isNaN(amount)) {
            return message.reply("Use: `!add-coins @member Amount`");
        }

        const data = loadData();
        const userId = selectedUser.id;

        const userData = getUserData(data, userId); 

        userData.coins += amount;
        
        saveData(data);

        await message.channel.send(`Added **${amount}** coins to <@${userId}>`);
    }
};

module.exports = [balanceCommand, addCoinsCommand];
