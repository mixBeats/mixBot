const helpCommand = {
  name: 'help',
  description: 'gives help about mixbeat',
  async execute(message, args) {
message.channel.send(`**mixBot commands**

Moderation ----
\`mb!ban\` - Bans a user
\`mb!kick\` - Kicks a user
\`mb!mute\` - Mutes a user for a duration

Currency ----
\`mb!add-coins\` - Adds coins to a person (Admin only)
\`mb!remove-coins\` - Removes coins from a person (Admin only)
\`mb!give\` - Gives coins to a member
\`mb!top\` - Gives top 10 leaderboard for currency
\`mb!bal\` - Checks for your balance

Level ----
\`mb!rank\` - Shows your level up
\`mb!lb\` - Shows top 10 leaderboard for level up

Other ----
\`mb!help\` - Shows this help command
`);


  }
};
module.exports = [helpCommand];
