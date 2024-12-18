import { DEFAULT_CLIENT_INTENTS, DEFAULT_CLIENT_PARTIALS } from "@/utils/constants";
import { Client } from "discord.js";
import EventListenerManager from "@/handlers/events/EventListenerManager";
import ComponentManager from "@/handlers/components/ComponentManager";
import CommandManager from "@/handlers/commands/CommandManager";

// Ensure the bot has a valid Discord token
if (!process.env.DISCORD_TOKEN) {
    throw new Error("Invalid environment variable");
}

/**
 * The main client instance for the Discord bot.
 * 
 * This client instance will be used for interacting with the Discord API.
 * It is configured with the required intents and partials to capture necessary events.
 */
export const client: Client<true> = new Client({
    intents: DEFAULT_CLIENT_INTENTS, // Intents determine the types of events the bot listens to
    partials: DEFAULT_CLIENT_PARTIALS  // Partials allow the bot to handle incomplete data
});

/**
 * Initialize and start the bot by caching components and commands, logging in, 
 * publishing commands to Discord, and mounting event listeners.
 * 
 * This function performs all the necessary setup and will emit the `ready` event 
 * once everything is ready for interaction.
 */
(async () => {
    // Cache all components (e.g., buttons, selects)
    await ComponentManager.cache();

    // Cache all commands and register them globally or by guild
    await CommandManager.cache();

    // Log in the bot with the token from the environment variables
    await client.login(process.env.DISCORD_TOKEN);

    // Publish the cached commands to Discord
    await CommandManager.publish();

    // Mount all event listeners to the client
    await EventListenerManager.mount();

    // Emit the "ready" event after mounting event listeners
    client.emit("ready", client);
})();
