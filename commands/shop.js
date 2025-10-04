const getItems = require('../items');

const shopCommand = {
  name: 'shop',
  description: 'shows all available items in the bot',

    async execute(message) {
      const items = getItems();

      if(items.length === 0){
        return message.channel.send("The Shop is empty");
      }

      let reply = "**mixBeats Shop** \n";
      items.forEach((item, index) => {
        reply += `${index}. ${item.name} - ${item.price} coins \n ${item.description} \n`;
      });

      message.channel.send(reply);
      
    }
};

module.exports = [shopCommand];
