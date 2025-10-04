const { getItems } = require('../items');

module.exports = {
  name: 'shop',
  description: 'shows all items in the shop',
  async execute(message) {
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
};
