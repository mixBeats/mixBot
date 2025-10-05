const { addItem, removeItem, getItems, editItem } = require('../items');

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

    if(!name || !field || !newValue){
      return message.reply("Use: `mb!edit-items <name OR price OR description>`")
    }

    const validFields = ['name', 'price', 'description'];
      if (!validFields.includes(field.toLowerCase())) {
        return message.reply("❌ You can edit: `name` or `price` or `description`");
      }

    const success = editItem(name, field, newValue);
    if(!success){
      return message.reply("❌ Item not found");
    }
    
    message.channel.send(`Edited ${name} item`);
    }
  }
];
