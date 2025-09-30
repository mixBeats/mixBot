const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join("/data", "levels.json");

if(!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

function loadData(){
  try{
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      console.log('successfully saved data');
  }
    catch(err){
    console.log('cannot save data');
    }
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
      data[userId] = { coins: 0, xp: 0, level: 1 };
    }
      if(data[userId].coins === undefined) {
      data[userId].coins = 0;
      saveData(data);
    }

    const coins = data[userId].coins;
    
    message.channel.send(`${message.author.username} Coins: **${coins}**`);
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
      const amount = parseInt(args[1]);

      if(!selected_user || isNaN(amount)){
        return message.reply("Command Use: mb!add-coins @member Amount");
      }

        const userId = selected_user.id;

        if (!data[userId]) {
          data[userId] = { coins: 0, xp: 0, level: 1 };
        } else if (data[userId].coins === undefined) {
          data[userId].coins = 0;
        }

        data[userId].coins += amount;

        saveData(data);

      message.channel.send(`Added **${amount}** coins to <@${userId}>`);
    }
};

module.exports = [balanceCommand, AddCoinsCommand];
