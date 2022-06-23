import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "./command";

class Ping extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Replies with something!")
        );
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply("Pong!");
    }
}

export { Ping };
