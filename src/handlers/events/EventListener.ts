import { ClientEvents, Events } from "discord.js";

/**
 * Abstract base class for creating event listeners in a Discord bot.
 * 
 * This class serves as a foundation for handling Discord client events.
 * Each event listener must extend this class and implement the {@link execute} method
 * to define the logic for the event.
 */
export default abstract class EventListener {
    /**
     * Creates an instance of an event listener.
     * 
     * @param event The event name to handle. Must be one of the keys of {@link ClientEvents}.
     * @param options Additional options for the event listener.
     * @param options.once Whether the event listener should only be triggered once. Default is `false`.
     * @protected
     */
    protected constructor(
        public event: Extract<Events, keyof ClientEvents>,
        public options?: { once: boolean }
    ) { }

    /**
     * The logic to execute when the event is triggered.
     * 
     * Subclasses must implement this method to define how the event should be handled.
     * 
     * @param args The arguments passed to the event listener by the Discord client.
     * These arguments depend on the specific event being handled.
     * @returns A promise or void, depending on whether the implementation is asynchronous.
     */
    abstract execute(...args: unknown[]): Promise<void> | void;
}
