import Command from "@/handlers/commands/Command";
import { SILENT_MESSAGE } from "@/utils/constants";
import Logger from "@/utils/logger";
import { ChatInputCommandInteraction } from "discord.js";

export default class PingCommand extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "ping",
            description: "Ping Pong!",
        }, [/* Add Guild ID entries here if you want to restrict the command to certain guilds */]);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const sent = await interaction.reply({ content: "Pinging...", fetchReply: true, flags: [SILENT_MESSAGE] });
            
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            await interaction.editReply({
                content: `🏓 Pong!\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`
            });
        } catch (err: any) {
            Logger.error(`Failed to execute PingCommand: ${err.message}`);
            await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    }
}
