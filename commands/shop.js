const { addItem, removeItem, getItems } = require('../items');

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
      reply += `**${index}. ${item.name}** - ${item.price} coins\n ${item.description}\n`;
    });
      message.channel.send(reply);
    }
  },
  {
  name: 'items-add',
  description: 'Adds an item in the shop',
  async execute(message, args) {
  if(!message.member.permissions.has("Administrator")){
    return message.reply("❌ You do not have premissions to add items");
    }

  const [name, price, ...descParts] = args;
  const description = descParts.join(" ");

  if(!name || !price || !descParts){
    return message.reply("Use: `mb!add-item <name> <price> <description>`");
  }

  addItem(name, parseInt(price), description);
  message.channel.send(`✅ Successfully made ${name} item`);
    };
  },
  
{
  name: 'items-remove',
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
  }
];
