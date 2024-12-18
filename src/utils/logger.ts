/** 
 * Utility class for logging messages with ANSI color formatting. 
 * Provides methods for logging messages at different levels (info, warn, error) 
 * with customizable color and formatting options.
 */
export default class Logger {
    /**
     * ANSI color codes for terminal output.
     * Use these constants to apply colors to log messages.
     */
    static Color = {
        /** Resets all terminal colors and formatting. */
        Reset: "\x1b[0m",

        // Regular Colors
        /** Black color code. */
        Black: "\x1b[30m",
        /** Red color code. */
        Red: "\x1b[31m",
        /** Green color code. */
        Green: "\x1b[32m",
        /** Yellow color code. */
        Yellow: "\x1b[33m",
        /** Blue color code. */
        Blue: "\x1b[34m",
        /** Magenta color code. */
        Magenta: "\x1b[35m",
        /** Cyan color code. */
        Cyan: "\x1b[36m",
        /** White color code. */
        White: "\x1b[37m",
        /** Grey color code. */
        Grey: "\x1b[90m",
    };

    /**
     * Logs a message to the console with the specified level and options.
     *
     * - **Output format**: `[timestamp] [level] {message}`
     * - **Example**: `[12:00:00] [INFO] Hello, world!`
     *
     * @param level - The log level (e.g., INFO, WARN, ERROR).
     * @param message - The message to log.
     * @param options - (Optional) Additional formatting options for the log.
     * @param options.color - The color to use for the log. Use `Logger.Color` constants.
     * @param options.fullColor - If `true`, applies the color to the entire log. Defaults to coloring only the log level.
     */
    static log(level: string, message: string, options?: ColorOptions): void {
        const timestamp = new Date().toLocaleTimeString();
        const formattedTimestamp = `${Logger.Color.Grey}[${timestamp}]${Logger.Color.Reset}`;

        if (!options?.color) {
            console.log(`${Logger.Color.Green}${formattedTimestamp}${Logger.Color.Reset} [${level}] ${message}`);
            return;
        }

        const colorCodes = options.color;
        if (options.fullColor) {
            console.log(`${formattedTimestamp} ${colorCodes}[${level}] ${message}${Logger.Color.Reset}`);
        } else {
            console.log(`${formattedTimestamp} ${colorCodes}[${level}]${Logger.Color.Reset} ${message}`);
        }
    }

    /**
     * Logs a message with an `[INFO]` tag in cyan.
     *
     * @param message - The informational message to log.
     */
    static info(message: string): void {
        Logger.log("INFO", message, {
            color: Logger.Color.Cyan
        });
    }

    /**
     * Logs a message with an `[ERROR]` tag in red.
     *
     * @param message - The error message to log.
     */
    static error(message: string): void {
        Logger.log("ERROR", message, {
            color: Logger.Color.Red
        });
    }

    /**
     * Logs a message with a `[WARN]` tag in yellow.
     *
     * @param message - The warning message to log.
     */
    static warn(message: string): void {
        Logger.log("WARN", message, {
            color: Logger.Color.Yellow
        });
    }
}

/**
 * Options for configuring the logger output.
 */
interface ColorOptions {
    /** 
     * The ANSI color code to use for the log. 
     * Use one of the color constants in {@link Logger.Color}.
     */
    color?: string;

    /** 
     * Whether to apply the color formatting to the entire log message. 
     * Defaults to `false`, applying color only to the log level tag.
     */
    fullColor?: boolean;
}
