const fs = require("fs");
const DATA_FILE = "/data/levels.json";

if(!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

function loadData(){
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Balance Command
const balanceCommand = {
  name: "bal",
  description: "Check your balance",
  async execute(message, args, client){
    const data = loadData();

      const userId = message.author.id;
      if(!data[userId]) {
          data[userId] = { coins: 0 }; 
      }
      const user = data[userId];
    
    message.channel.send(`${message.author.username} Coins: **${data.coins}**`);
  }
};

// Add Coins Command
const AddCoinsCommand = {
  name: "add-coins",
  description: "Add coins to user",
    async execute(message, args, client){
      if(!message.member.permissions.has("Administrator")){
        return message.reply("❌ You do not have permission to run this command");
      }

      const data = loadData();
      const selected_user = message.mentions.users.first();
      const amount = args.find(arg => !isNaN(arg));

      if(!selected_user || amount === undefined){
        return message.reply("Command Use: mb!add-coins @member Amount");
      }

      const coinAmount = parseInt(amount);

      const userId = selected_user.id;
      if (!data[userId]) {
        data[userId] = { coins: 0 }; 
        }

      data[userId].coins += amount;
      saveData(data);

      message.channel.send(`Added **${coinAmount}** to <@${userId}>`);
    }
};

module.exports = [balanceCommand, AddCoinsCommand];
