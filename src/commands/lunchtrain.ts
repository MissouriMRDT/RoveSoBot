import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import moment from "moment";
import { Command } from "./command";

class LunchTrain extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("lunchtrain")
                .addStringOption((option) =>
                    option
                        .setName("location")
                        .setDescription("Where are you meeting?")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("time")
                        .setDescription(
                            "What time are you meeting? (Ex: '5:30 pm')"
                        )
                        .setRequired(true)
                )
                .setDescription("Starts a Lunch Train")
        );
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        const time = moment(interaction.options.getString("time"), ["h:m a"]);

        await interaction.reply(moment(time).calendar());
    }
}

export { LunchTrain };
