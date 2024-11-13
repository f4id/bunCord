import Command from "@/handlers/commands/Command";
import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

export default class ExampleAutocompleteCommand extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "example",
            description: "An example command with autocomplete.",
            options: [
                {
                    name: "query",
                    description: "Type to get suggestions",
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true,
                },
            ],
        });
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const query = interaction.options.getString("query");
        await interaction.reply(`You searched for: ${query}`);
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedValue = interaction.options.getFocused();

        const suggestions = ["apple", "banana", "cherry", "date", "elderberry"];
        const filteredSuggestions = suggestions.filter(s =>
            s.toLowerCase().startsWith(focusedValue.toLowerCase())
        );

        await interaction.respond(
            filteredSuggestions.map(suggestion => ({ name: suggestion, value: suggestion }))
        );
    }
}
