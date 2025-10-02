const banCommand = {
  name: 'ban',
  description: 'bans a member',
  async execute(message, args) {
    if (!messsage.member.permissions.has('BanMembers')){
      return message.reply("❌ You do not have premission to use this command");
    }

    const target = message.mentions.members.first();

    if(!target){
      return message.reply("You must mention a member");
    }

    const reason = args.slice(1).join(' ') || 'No reasons provided';

    try{
      await target.ban(reason);
      message.channel.send(`Successfully banned ${target.user.tag} Reason: ${reason}`);
    }
    catch (err){
      message.reply('Failed to ban this user');
      }
    }
  };

const kickCommand = {
  name: 'kick',
  description: 'kicks a member',
  async execute(message, args) {
    if (!messsage.member.permissions.has('KickMembers')){
      return message.reply("❌ You do not have premission to use this command");
    }

    const target = message.mentions.members.first();

    if(!target){
      return message.reply("You must mention a member");
    }

    const reason = args.slice(1).join(' ') || 'No reasons provided';

    try{
      await target.kick(reason);
      message.channel.send(`Successfully kicked ${target.user.tag} Reason: ${reason}`);
    }
    catch (err){
      message.reply('Failed to kick this user');
      }
    }
  };

const muteCommand = {
  name: 'mute',
  description: 'mutes a member for a duration',
  async execute(message, args) {

    if(!message.member.permissions.has('ModerateMembers')){
      return message.reply("❌ You do not have premission to use this command");
    }

    const target = message.mentions.members.first();
    if(!target) return message.reply("You must mention a member, Use: `mb!mute @member time(seconds)`");

    const duration = ms(duration);
    if(!duration) return message.reply("You must have a duration, Use: `mb!mute @member time(seconds)`");

    const reason = args.slice(2).join(' ') || 'No reason provided';

    try{
      await target.timeout(duration, reason);
      message.channel.send(`Timed out ${target.user.tag} for ${duration} Reason: ${reason}`);
    }
    catch(err){
      message.reply("Failed to timeout this member");
    }
    
  }
};

module.exports = [banCommand, kickCommand, muteCommand];
