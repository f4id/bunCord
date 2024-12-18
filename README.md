
# buncord

**buncord** is a Discord bot template built using **Discord.js** and **Bun** as the runtime. It provides a simple foundation for creating Discord bots with Bun for fast performance and modern JavaScript/TypeScript features.

## Features

- Built with [Discord.js](https://discord.js.org/) for interacting with the Discord API.
- Uses [Bun](https://bun.sh/) as the runtime for fast performance.
- Modern TypeScript support.
- Easy-to-use structure for extending bot functionality.

## Prerequisites

Before you start, ensure you have the following installed:

- **Bun**: Bun is a modern JavaScript runtime like Node, but faster. You can install it from the [official Bun website](https://bun.sh/).
- **Git**: Git is required to clone the repository.
- **Discord Bot Token**: You’ll need to create a bot on [Discord Developer Portal](https://discord.com/developers/applications) and obtain a token.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/f4id/bunCord.git
   cd bunCord
   ```

2. **Install dependencies**:
   Since we are using Bun as the runtime, you can install the dependencies with:
   ```bash
   bun install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root of the project and add your Discord bot token:
   ```bash
   DISCORD_TOKEN=your_discord_bot_token
   ```

## Running the Bot

Once the dependencies are installed and the `.env` file is set up, you can start the bot using Bun's built-in command:

```bash
bun start
```

This will execute the `src/index.ts` file and launch your bot.

### Development Mode

For local development, you can use Bun’s fast refresh to automatically reload the bot when files are modified. Simply run:

```bash
bun dev
```

This will start your bot with automatic file watching and reloading on changes.

## Directory Structure

Here is the basic directory structure:

```
/bunCord
│
├── /src               # Source code for the bot
│   ├── index.ts       # Main entry point for the bot
│   ├── /commands      # Command files for the bot
│   └── /handlers      # Event handlers, components, etc.
│
├── /node_modules      # Dependencies installed via Bun
├── package.json       # Project configuration
├── tsconfig.json      # TypeScript configuration
└── .env               # Environment variables (including bot token)
```

## Configuring the Bot

1. **Environment Variables**:
   Make sure to define `DISCORD_TOKEN` in your `.env` file. The bot uses this token to authenticate with the Discord API.

2. **Command Registration**:
   The bot uses a command manager to register and cache commands. The bot will automatically cache and publish commands during startup.

3. **Event Handling**:
   Event listeners are set up in the `EventListenerManager` to handle events like message creation, interactions, etc. You can extend these to fit your bot’s functionality.

## Adding New Commands

To add a new command:

1. Create a new file inside the `/src/commands` folder.
2. Extend the `Command` class, implement the required methods (`build`, `execute`, etc.), and define the command data (name, description).
3. The command will be cached and published automatically upon bot startup.

## Contributing

If you want to contribute to the project, feel free to fork the repository and submit a pull request. Please follow the established coding standards and include tests if applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [f4id](https://github.com/f4id)