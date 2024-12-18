import { AutocompleteInteraction, Collection, CommandInteraction, Snowflake } from "discord.js";
import { BaseError, ensureError, ErrorType } from "@/utils/errors";
import { pluralize } from "@/utils";
import { client } from "@/index";

import Logger from "@/utils/logger";
import Command from "./Command";
import path from "path";
import fs from "fs";

/**
 * Utility class for handling command interactions in the Discord bot.
 * 
 * This class is responsible for caching, publishing, and executing commands.
 * It handles both global and guild-specific commands and provides methods
 * to manage command interactions, including autocomplete functionality.
 */
export default class CommandManager {
    /** Cached global commands mapped by their names. */
    private static _globalCommands = new Collection<string, Command<CommandInteraction>>();

    /** Cached guild commands mapped by their guild's ID. */
    private static _guildCommands = new Collection<Snowflake, Collection<string, Command<CommandInteraction>>>();

    /**
     * Caches all commands from the commands directory.
     * 
     * This method imports command modules, verifies they are instances of the `Command` class,
     * and caches them either globally or by guild ID.
     */
    static async cache(): Promise<void> {
        const dirpath = path.resolve("src/commands");

        if (!fs.existsSync(dirpath)) {
            Logger.info("Skipping command caching: commands directory not found");
            return;
        }

        Logger.info("Caching commands...");

        const filenames = fs.readdirSync(dirpath);
        let commandCount = 0;

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                const commandModule = await import(filepath);
                const commandClass = commandModule.default;
                const command = new commandClass();

                if (!(command instanceof Command)) {
                    continue;
                }

                const logMessage = `Cached command "${command.data.name}"`;

                if (command.guildIds?.length) {
                    for (const guildId of command.guildIds) {
                        let guildCommands = CommandManager._guildCommands.get(guildId);

                        if (!guildCommands) {
                            guildCommands = new Collection<string, Command<CommandInteraction>>();
                            CommandManager._guildCommands.set(guildId, guildCommands);
                        }

                        guildCommands.set(command.data.name, command);

                        Logger.log(`GUILD: ${guildId}`, logMessage, {
                            color: Logger.Color.Blue
                        });
                    }
                } else {
                    CommandManager._globalCommands.set(command.data.name, command);

                    Logger.log("GLOBAL", logMessage, {
                        color: Logger.Color.Magenta,
                        fullColor: true
                    });
                }

                commandCount++;
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache commands", {
                name: ErrorType.CommandCachingError,
                cause
            });
        }

        Logger.info(`Cached ${commandCount} ${pluralize(commandCount, "command")}`);
    }

    /**
     * Publishes all cached commands to Discord.
     * 
     * This method publishes both global and guild-specific commands to Discord's API.
     * It ensures that the commands are properly set for each guild and globally.
     */
    static async publish(): Promise<void> {
        Logger.info("Publishing commands...");

        const logMessage = (commandCount: number) => `Published ${commandCount} ${pluralize(commandCount, "command")}`;

        for (const [guildId, guildCommands] of CommandManager._guildCommands) {
            const guild = await client.guilds.fetch(guildId).catch(cause => {
                throw new BaseError(`Failed to fetch guild while publishing commands [ID: ${guildId}]`, {
                    name: ErrorType.CommandPublishError,
                    cause
                });
            });

            const commands = guildCommands.map(command => command.build());
            const publishedCommands = await guild.commands.set(commands);

            if (!publishedCommands) {
                throw new BaseError(`Failed to publish guild commands [ID: ${guildId}]`, {
                    name: ErrorType.CommandPublishError
                });
            }

            Logger.log(`GUILD: ${guildId}`, logMessage(publishedCommands.size), {
                color: Logger.Color.Blue
            });
        }

        const globalCommands = CommandManager._globalCommands.map(command => command.build());

        if (!globalCommands.length) return;

        const publishedCommands = await client.application.commands.set(globalCommands);

        if (!publishedCommands) {
            throw new BaseError("Failed to publish global commands", {
                name: ErrorType.CommandPublishError
            });
        }

        Logger.log("GLOBAL", logMessage(publishedCommands.size), {
            color: Logger.Color.Magenta,
            fullColor: true
        });

        Logger.info("Finished publishing commands");
    }

    /**
     * Handles a command interaction by retrieving the command and executing it.
     * 
     * This method is triggered when a user interacts with a slash command.
     * It retrieves the relevant command and calls its `execute` method.
     * 
     * @param interaction The command interaction to handle.
     */
    static async handleCommand(interaction: CommandInteraction): Promise<void> {
        const command = await CommandManager._get(
            interaction.commandId,
            interaction.commandName,
            interaction.guildId
        );

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        await command.execute(interaction);
    }

    /**
     * Handles an autocomplete interaction by retrieving the command and calling its `autocomplete` method.
     * 
     * This method is triggered when a user interacts with a command's autocomplete feature.
     * It ensures that the command has an `autocomplete` method before calling it.
     * 
     * @param interaction The autocomplete interaction to handle.
     */
    static async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const command = await CommandManager._get(
            interaction.commandId,
            interaction.commandName,
            interaction.guildId
        );

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        // Ensure the command has an autocomplete() method
        if (!command.autocomplete) {
            throw new Error(`Command "${interaction.commandName}" does not have an autocomplete() method`);
        }

        await command.autocomplete(interaction);
    }

    /**
     * Retrieves a command by its ID and name for either a global or guild-specific command.
     * 
     * This method is used to look up commands in the cache by their ID, name, and the guild they belong to.
     * 
     * @param commandId The command's ID.
     * @param commandName The command's name.
     * @param guildId The ID of the guild the command was issued in, if applicable.
     * @private
     */
    private static async _get(
        commandId: Snowflake,
        commandName: string,
        guildId: Snowflake | null
    ): Promise<Command<CommandInteraction> | undefined> {
        // application.commands only contains global commands
        const isGlobalCommand = client.application.commands.cache.has(commandId);

        if (isGlobalCommand) {
            return CommandManager._globalCommands.get(commandName);
        }

        if (!guildId) return;

        const guildCommands = CommandManager._guildCommands.get(guildId);
        return guildCommands?.get(commandName);
    }
}
