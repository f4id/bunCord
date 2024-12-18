import { DEFAULT_COMMAND_PERMISSIONS, DEFAULT_DM_PERMISSION } from "@/utils/constants";
import { CommandInteraction, ApplicationCommandData, Snowflake, AutocompleteInteraction } from "discord.js";

/**
 * Abstract base class for handling slash commands.
 * This class provides a foundation for creating and managing slash commands in Discord.
 * Extend this class to define specific command behaviors.
 *
 * @template T - The type of interaction this command handles, extending {@link CommandInteraction}.
 */
export default abstract class Command<T extends CommandInteraction> {
    /**
     * Constructs a new command instance.
     *
     * @param data - The metadata for the slash command, such as its name, description, and options.
     * @param guildIds - (Optional) The ID(s) of the guilds where the command should be published. 
     *                   If omitted, the command will be published globally.
     * @protected
     */
    protected constructor(public data: ApplicationCommandData, public guildIds?: Snowflake[]) {}

    /**
     * Executes the command interaction.
     * Implement this method in a subclass to define the command's behavior when invoked.
     *
     * @param interaction - The interaction instance representing the command invocation.
     * @returns A promise resolving when execution is complete, or `void` if the command is synchronous.
     */
    abstract execute(interaction: T): Promise<void> | void;

    /**
     * Handles the autocomplete interaction for the command.
     * Override this method in a subclass to define custom autocomplete behavior.
     *
     * @param interaction - The interaction instance representing the autocomplete event.
     * @returns A promise resolving when the handling is complete, or `void` if synchronous.
     */
    autocomplete?(interaction: AutocompleteInteraction): Promise<void> | void;

    /**
     * Builds the command's metadata, including default permissions and DM settings.
     * By default, this includes {@link DEFAULT_COMMAND_PERMISSIONS} and {@link DEFAULT_DM_PERMISSION}.
     *
     * @returns The {@link ApplicationCommandData} object representing the command's metadata.
     */
    build(): ApplicationCommandData {
        return {
            defaultMemberPermissions: DEFAULT_COMMAND_PERMISSIONS,
            dmPermission: DEFAULT_DM_PERMISSION,
            ...this.data
        };
    }
}
