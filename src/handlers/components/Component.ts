import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

/**
 * The base class for all component interactions.
 * 
 * This class serves as the foundation for creating custom components that handle
 * interactions like button presses or modal submissions. Subclasses must implement
 * the `execute` method to define their specific behavior.
 */
export default abstract class Component {
    /**
     * The custom ID of the component. This ID is used to identify the component
     * during interactions and ensures the correct component is handled.
     * 
     * @param customId The unique identifier for the component.
     * @protected
     */
    protected constructor(public customId: CustomID) {
    }

    /**
     * Handles the interaction with the component. Subclasses must implement this
     * method to define what happens when the component is interacted with.
     * 
     * @param interaction The interaction to handle, which could be a button press
     * or modal submission.
     * @returns A promise or void, depending on whether the interaction handling is asynchronous.
     */
    abstract execute(interaction: ComponentInteraction): Promise<void> | void;
}

/**
 * A type that encompasses the possible interactions a component can have.
 * This includes interactions with message components (like buttons) and modal submissions.
 */
export type ComponentInteraction = MessageComponentInteraction | ModalSubmitInteraction;

/**
 * A type representing the custom ID of a component.
 * This ID is used to uniquely identify components during interactions.
 */
export type CustomID = string;
