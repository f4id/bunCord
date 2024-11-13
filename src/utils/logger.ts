/** Options for the logger. */
interface ColorOptions {
    /** The color to use for the log. */
    color?: string;
    /** Whether to use full color formatting. */
    fullColor?: boolean;
}

/** Utility class for logging messages. */
export default class Logger {

    /** ANSI color codes for terminal output. */
    static Color = {
        // Reset
        Reset: "\x1b[0m",

        // Regular Colors
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
        Grey: "\x1b[90m",
    }

    /**
     * Logs a message to the console.
     *
     * - **Output format**: `[timestamp] [level] {message}`
     * - **Example**: `[1970-01-01T00:00:00.000Z] [INFO] Hello, world!`
     *
     * @param level The level for the log.
     * @param message The message to log.
     * @param options The options for the logger.
     */
    static log(level: string, message: string, options?: ColorOptions): void {
        const timestamp = new Date().toISOString();
        const formattedTimestamp = `${Logger.Color.Grey}[${timestamp}]${Logger.Color.Reset}`;

        // Default output if no color is specified.
        if (!options?.color) {
            console.log(`${Logger.Color.Green}${formattedTimestamp}${Logger.Color.Reset} [${level}] ${message}`);
            return;
        }
        const colorCodes = options.color;
        if (options.fullColor) {
            // Color the entire log.
            console.log(`${formattedTimestamp} ${colorCodes}[${level}] ${message}${Logger.Color.Reset}`);
        } else {
            // Only color the tag.
            console.log(`${formattedTimestamp} ${colorCodes}[${level}]${Logger.Color.Reset} ${message}`);
        }
    }

    /** Uses {@link Logger#log} with a cyan `[INFO]` tag */
    static info(message: string): void {
        Logger.log("INFO", message, {
            color: Logger.Color.Cyan
        });
    }

    /** Uses {@link Logger#log} with a red `Bold [ERROR]` tag */
    static error(message: string): void {
        Logger.log("ERROR", message, {
            color: Logger.Color.Red
        });
    }

    /** Uses {@link Logger#log} with a yellow `[WARN]` tag */
    static warn(message: string): void {
        Logger.log("WARN", message, {
            color: Logger.Color.Yellow
        });
    }
}