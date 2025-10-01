const storage = require("node-persist");

module.exports = {
    name: 'top',
  description: 'Top leaderboard for currency',
  async execute(message, args, client) {
    const data = await storage.values();

    if (!data.length) {
      return message.channel.send("No users found in the database yet!");
    }

  const users = data
      .map(entry => ({
        userId: entry.userId,
        coins: entry.coins || 0
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10);

    let leaderboard = "**mixBeats currency leaderboard** \n";
    for(const i = 0; i<users.length; i++){
      const user = await client.users.fetch(users[i].userId).catch(() => null);
      const name = user ? user.username : "Unknown User";
      leaderboard += `${i}. ${user.username} - Coins: ${users[i].coins} \n`;
    }

    message.channel.send(leaderboard || "No data yet");
  }
};
