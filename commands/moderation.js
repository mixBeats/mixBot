const { PermissionsBitField } = require("discord.js");
const ms = require("ms");

const banCommand = {
  name: 'ban',
  description: 'Bans a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("❌ You do not have permission to use this command");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply("You must mention a member");

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await target.ban({ reason });
      message.channel.send(`Successfully banned **${target.user.tag}** Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      message.reply('❌ Failed to ban this user');
    }
  }
};

const kickCommand = {
  name: 'kick',
  description: 'Kicks a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("❌ You do not have permission to use this command");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply("You must mention a member");

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await target.kick(reason);
      message.channel.send(`Successfully kicked **${target.user.tag}** Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      message.reply('❌ Failed to kick this user');
    }
  }
};

const muteCommand = {
  name: 'mute',
  description: 'Mutes a member for a duration',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply("❌ You do not have permission to use this command");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply("You must mention a member, Use: `mb!mute @member time`");

    const duration = ms(args[1]);
    if (!duration) return message.reply("Invalid duration! Use `10s`, `5m`, `1h`");

    const reason = args.slice(2).join(' ') || 'No reason provided';

    try {
      await target.timeout(duration, reason);
      message.channel.send(`Timed out **${target.user.tag}** for ${args[1]} Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to timeout this member");
    }
  }
};

module.exports = [banCommand, kickCommand, muteCommand];
