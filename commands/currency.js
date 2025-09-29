module.exports = {
  name: "bal",
  description: "Check your balance",
  async execute(message, args){
    const number = 15;
    message.channel.send(`Your balance is ${number}`);
  }, 
};
