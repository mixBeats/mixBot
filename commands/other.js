const helpCommand = {
  name: 'help',
  description: 'gives help about mixbeat',
  async execute(message, args) {
    message.channel.send('**mixBot commands** 
                         \n `Moderation ----`
                         \n `mb!ban` - Bans a user
                         \n `mb!kick` - kicks a user
                         \n `mb!mute` - Mutes a user for a duration
                         \n `Currency ----`
                         \n `mb!add-coins` - Adds coins to a person (Admin only)
                         \n `mb!remove-coins` - Removes coins to a person (Admin only)
                         \n `mb!give` - Gives coins to a member
                         \n `mb!top` - Gives top 10 leaderboard for currency
                         \n `mb!bal` - Checks for your balance
                         \n `Level ----`
                         \n `mb!rank` - Shows your level up
                         \n `mb!lb` - Shows top 10 leaderboard for level up
                         \n `Other ----`
                         \n `mb!help` - Shows this help command ');
  }
};
module.exports = [helpCommand];
