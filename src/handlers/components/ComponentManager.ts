import { BaseError, ensureError, ErrorType } from "@/utils/errors";
import { pluralize } from "@/utils";

import Component, { ComponentInteraction, CustomID } from "./Component";
import Logger from "@/utils/logger";
import path from "path";
import fs from "fs";

/**
 * A utility class for managing component interactions in a Discord bot.
 *
 * This class is responsible for caching components and handling their interactions
 * based on unique custom IDs.
 */
export default class ComponentManager {
    /**
     * A cache that maps custom IDs to their corresponding {@link Component} instances.
     * 
     * This is used to efficiently retrieve and execute components during interactions.
     * 
     * @private
     */
    private static _cache = new Map<CustomID, Component>();

    /**
     * Caches all components found in the `src/components` directory.
     * 
     * This method dynamically imports and initializes all component files, ensuring
     * that only valid {@link Component} instances are added to the cache.
     * 
     * @throws {BaseError} If an error occurs while caching components.
     */
    static async cache(): Promise<void> {
        const dirpath = path.resolve("src/components");

        if (!fs.existsSync(dirpath)) {
            Logger.info("Skipping component caching: components directory not found");
            return;
        }

        Logger.info("Caching components...");

        const filenames = fs.readdirSync(dirpath);
        let componentCount = 0;

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                const componentModule = await import(filepath);
                const componentClass = componentModule.default;
                const component = new componentClass();

                if (!(component instanceof Component)) {
                    continue;
                }

                ComponentManager._cache.set(component.customId, component);

                Logger.log("GLOBAL", `Cached Component ${component.customId}`, {
                    color: Logger.Color.Magenta,
                    fullColor: true
                });

                componentCount++;
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache components", {
                name: ErrorType.ComponentCachingError,
                cause
            });
        }

        Logger.info(`Cached ${componentCount} ${pluralize(componentCount, "component")}`);
    }

    /**
     * Handles an incoming component interaction.
     * 
     * This method retrieves the corresponding {@link Component} instance from the cache
     * using the custom ID of the interaction and executes its logic.
     * 
     * @param interaction The interaction to handle.
     * @throws {Error} If the component corresponding to the custom ID is not found.
     */
    static async handle(interaction: ComponentInteraction): Promise<void> {
        const component = ComponentManager._cache.get(interaction.customId);

        if (!component) {
            throw new Error(`Component "${interaction.customId}" not found`);
        }

        await component.execute(interaction);
    }
}
