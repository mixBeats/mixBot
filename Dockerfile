# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the bot code
COPY . .

# Expose any port (optional, Discord bot doesn’t need a port)
EXPOSE 3000

# Run the bot
CMD ["node", "index.js"]
