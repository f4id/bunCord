import { BaseError, ensureError, ErrorType } from "@/utils/errors";
import { pluralize } from "@/utils";
import { client } from "@/index";

import EventListener from "./EventListener";
import Logger from "@/utils/logger";
import path from "path";
import fs from "fs";

/**
 * Utility class for managing event listeners in the Discord bot.
 */
export default class EventListenerManager {
    /**
     * Mounts all event listeners from the `src/events` directory.
     * 
     * This method dynamically imports and initializes event listeners from
     * the specified directory, registering them to the Discord client. Each
     * event listener must extend the {@link EventListener} class.
     * 
     * ### Logging:
     * - Logs the start and end of the event mounting process.
     * - Logs individual events being mounted with `ON` or `ONCE` status.
     * 
     * ### Error Handling:
     * - Throws a {@link BaseError} if an error occurs during the mounting process.
     * - Logs a warning if the `src/events` directory does not exist.
     * 
     * @returns {Promise<void>} Resolves when all event listeners are successfully mounted.
     * @throws {BaseError} If an error occurs during the event mounting process.
     */
    static async mount(): Promise<void> {
        const dirpath = path.resolve("src/events");

        if (!fs.existsSync(dirpath)) {
            Logger.info("Skipping event mounting: events directory not found");
            return;
        }

        Logger.info("Mounting event listeners...");

        const filenames = fs.readdirSync(dirpath);
        let eventListenerCount = 0;

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);
                const listenerModule = await import(filepath);
                const listenerClass = listenerModule.default;
                const listener = new listenerClass();

                if (!(listener instanceof EventListener)) {
                    Logger.warn(`Skipped file "${filename}": Not an instance of EventListener`);
                    continue;
                }

                const logMessage = `Mounted event listener "${listener.event}"`;

                if (listener.options?.once) {
                    client.once(listener.event, (...args) => listener.execute(...args));
                    Logger.log("ONCE", logMessage, {
                        color: Logger.Color.Grey,
                        fullColor: true
                    });
                } else {
                    client.on(listener.event, (...args) => listener.execute(...args));
                    Logger.log("ON", logMessage, {
                        color: Logger.Color.Grey,
                    });
                }

                eventListenerCount++;
            }
        } catch (_error) {
            const cause = ensureError(_error);
            throw new BaseError("Failed to mount event listeners", {
                name: ErrorType.EventListenerMountError,
                cause
            });
        }

        Logger.info(`Mounted ${filenames.length} ${pluralize(filenames.length, "event listener")}`);
    }
}
