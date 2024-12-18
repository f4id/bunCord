import { ButtonInteraction } from "discord.js";
import Component from "@/handlers/components/Component";

export default class PingCheckButton extends Component {
    constructor() {
        super("pingCheck");
    }

    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true });
            
        // Recalculate latency
        const latency = Date.now() - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        await interaction.editReply({ content: `🏓 Pong again!\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms` });
    }
}
