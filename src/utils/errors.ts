import { ApplicationCommandOptionType, Interaction, Snowflake } from "discord.js";

/**
 * Enum representing various error types in the bot's execution lifecycle.
 */
export enum ErrorType {
    /** Represents an unknown or unsupported error. */
    UnknownError = "UnknownError",
    /** Represents an error during command publishing using {@link CommandManager#publish}. */
    CommandPublishError = "CommandPublishError",
    /** Represents an error during command caching using {@link CommandManager#cache}. */
    CommandCachingError = "CommandCachingError",
    /** Represents an error during event listener mounting using {@link EventListenerManager#mount}. */
    EventListenerMountError = "EventListenerMountError",
    /** Represents an error during component caching using {@link ComponentManager#cache}. */
    ComponentCachingError = "ComponentCachingError",
    /** Represents an error during interaction execution. */
    InteractionExecutionError = "InteractionExecutionError"
}

/**
 * Base class for custom errors in the bot.
 */
export class BaseError extends Error {
    /**
     * Constructs a new `BaseError`.
     * 
     * @param message - A human-readable description of the error.
     * @param options - Additional properties for the error.
     * @param options.name - A specific error type from {@link ErrorType}.
     * @param options.cause - The original error that caused this error.
     */
    constructor(message: string, options?: BaseErrorProps) {
        super(message);

        this.name = options?.name ?? ErrorType.UnknownError;
        this.cause = options?.cause;
    }
}

/**
 * Represents an error that occurred while executing a Discord interaction.
 */
export class InteractionExecuteError extends BaseError {
    /**
     * Constructs a new `InteractionExecuteError`.
     * 
     * @param interaction - The interaction that caused the error.
     * @param cause - The underlying error that caused the failure.
     */
    constructor(interaction: Interaction, cause: Error) {
        let interactionOptions: InteractionTraceOptions[] = [];
        let interactionName: string;

        // Extract interaction details based on type.
        if (interaction.isCommand() || interaction.isAutocomplete()) {
            interactionName = interaction.commandName;
            interactionOptions = interaction.options.data.map(option => ({
                name: option.name,
                type: ApplicationCommandOptionType[option.type],
                value: option.value
            }));
        } else {
            interactionName = interaction.customId;
        }

        const trace: InteractionTrace = {
            executorId: interaction.user.id,
            channelId: interaction.channelId,
            guildId: interaction.guildId,
            interaction: {
                name: interactionName,
                options: interactionOptions
            }
        };

        const stringifiedTrace = JSON.stringify(trace, null, 2);

        super(`Failed to execute interaction "${interactionName}"\n\n${stringifiedTrace}`, {
            name: ErrorType.InteractionExecutionError,
            cause
        });
    }
}

/**
 * Ensures the provided value is an instance of `Error`.
 * If not, it converts the value into an `Error` object.
 *
 * @param error - The value to ensure as an `Error`.
 * @returns An instance of `Error`.
 */
export function ensureError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    let parsedError: string;

    // Handle different data types for error conversion.
    if (typeof error === "object") {
        parsedError = JSON.stringify(error, null, 2);
    } else if (error !== undefined) {
        parsedError = error.toString();
    } else {
        parsedError = "An unknown error occurred - cannot parse error as it is undefined.";
    }

    return new Error(parsedError);
}

/**
 * Properties for the base error class.
 */
interface BaseErrorProps {
    /** The original error that caused this error, if applicable. */
    cause?: Error;
    /** The specific error type from {@link ErrorType}. */
    name?: ErrorType;
}

/**
 * Represents trace information for debugging an interaction.
 */
interface InteractionTrace {
    /** The ID of the user who executed the interaction. */
    executorId: Snowflake;
    /** The ID of the channel where the interaction occurred, or `null` if not applicable. */
    channelId: Snowflake | null;
    /** The ID of the guild where the interaction occurred, or `null` if it was in a direct message. */
    guildId: Snowflake | null;
    /** Details of the interaction, including name and options. */
    interaction: {
        /** The name or custom ID of the interaction. */
        name: string;
        /** The options provided with the interaction. */
        options: InteractionTraceOptions[];
    };
}

/**
 * Represents an option provided with a Discord interaction.
 */
interface InteractionTraceOptions {
    /** The name of the option. */
    name: string;
    /** The type of the option, formatted as `[EnumValue] EnumLabel`. */
    type: string;
    /** The value of the option provided by the user. */
    value: string | number | boolean | undefined;
}
