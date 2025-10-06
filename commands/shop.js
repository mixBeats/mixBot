const { addItem, removeItem, getItems, editItem } = require('../items');
const fs = require('fs');
const DATA_FILE = './levels.json';

module.exports = [
  {
  name: 'shop',
  description: 'shows all items in the shop',
  async execute(message, args) {
     const items = getItems();
  
      if (items.length === 0) {
        return message.channel.send("The shop is empty");
      }

   let reply = "**mixBeats Shop**\n";
    items.forEach((item, index) => {
      reply += `**${item.emoji} ${item.name}** - ${item.price} coins\n ${item.description}\n`;
    });
      message.channel.send(reply);
    }
  },
  {
  name: 'add-items',
  description: 'Adds an item in the shop',
  async execute(message, args) {
  if(!message.member.permissions.has("Administrator")){
    return message.reply("❌ You do not have premissions to add items");
    }

  const [name, emoji, price, ...descParts] = args;
  const description = descParts.join(" ");

  if(!name || !emoji || !price || !descParts){
    return message.reply("Use: `mb!add-item <name> <emoji> <price> <description>`");
  }

  addItem(name, emoji, parseInt(price), description);
  message.channel.send(`✅ Successfully made ${name} item`);
    }
  },
  
{
  name: 'remove-items',
  description: 'Removes an item in the shop',
  async execute(message, args) {
  if(!message.member.permissions.has("Administrator")){
    return message.reply("❌ You do not have premissions to remove items");
    }

  const name = args.join(" ");

  if(!name){
    return message.reply("Use: `mb!remove-item <name>`");
  }

  removeItem(name);
  message.channel.send(`Removed ${name} item`);
    }
  },

  {
  name: 'edit-items',
  description: 'Edits an item in the shop',
  async execute(message, args) {
  if(!message.member.permissions.has("Administrator")){
    return message.reply("❌ You do not have premissions to edit items");
    }

    const [name, field, ...valueParts] = args;
    const newValue = valueParts.join(" ");

    if(!name || !emoji || !field || !newValue){
      return message.reply("Use: `mb!edit-items <itemName> <new value>`")
    }

    const validFields = ['name', 'emoji', 'price', 'description'];
      if (!validFields.includes(field.toLowerCase())) {
        return message.reply("❌ You can edit: `name` or `emoji` or `price` or `description`");
      }

    const success = editItem(name, field, newValue);
    if(!success){
      return message.reply("❌ Item not found");
    }
    
    message.channel.send(`Edited ${name} item`);
    }
  }
  
  {
  name: 'buy',
  description: 'Buys an item',
  async execute(message, args, client) {
      const userId = message.author.id;
      const itemName = args.join(" ");

      if(!itemName){
        return message.reply("❌ You must name an item!");
      }

       const items = getItems();
       const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());

      if(!item){
        return message.reply("❌ Item not found");
      }

      const user = client.userData[userId];

      if(!user){
        return message.reply("You have no data!");
      }

      if(user.coins < item.price){
        return message.reply(`You have no enough coins to buy! Cost: ${item.price} coins`);
      }

      user.coins -= item.price;
      user.items.push(item.name);

      fs.writeFileSync(DATA_FILE, JSON.stringify(client.userData, null, 2));

      message.channel.send(`<@{userId}> You bought ${item.name} item!`);
      
    }
  },

{
  name: 'items',
  description: 'Shows all user items',
  async execute(message, args, client) {

    const userId = message.author.id;
    const user = client.userData[userId];

    if(!user.items.length === 0){
      return message.reply(`You do not have any items yet.`);
    }

    const allItems = getItems();

    let reply = `${message.author.username}'s Items \n`;
    user.items.forEach(itemName => {
      const shopItem = allItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      const emoji = shopItem?.emoji || "⬜";
      reply += `${emoji} - ${itemName} \n`;
    });

    message.channel.send(reply);
    
    }
  }
];
