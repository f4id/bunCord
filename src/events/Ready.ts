import { Client, Events } from "discord.js";
import EventListener from "@/handlers/events/EventListener";
import Logger from "@/utils/logger";

export default class Ready extends EventListener {
    constructor() {
        super(Events.ClientReady, {
            once: true
        });
    }

    async execute(client: Client<true>): Promise<void> {
        Logger.log("READY", `Successfully logged in as ${client.user.tag}`, {
            color: Logger.Color.Green,
            fullColor: true
        });
    }
}