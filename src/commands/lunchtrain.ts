import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CacheType,
    CommandInteraction,
    GuildTextBasedChannel,
    MessageActionRow,
    MessageButton,
    TextChannel,
} from "discord.js";
import moment from "moment";
import { Trains } from "../database/roveSoDatabase";
import { Command } from "./command";
import { Op } from "sequelize";
import { client } from "../index";
import { createTrain } from "../util/createTrain";
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
                            "What date and time are you meeting? (Ex: '5:30 pm', '8-24 5:30 pm)"
                        )
                        .setRequired(true)
                )
                .setDescription("Starts a Lunch Train"),
            false
        );
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "This command can only be used in servers",
                ephemeral: true,
            });
            return;
        }

        const time = moment(
            interaction.options.getString("time"),
            ["h:m a", "M-D h:m a"],
            true
        );

        // If moment parses it as a previous time, add twelve hours.
        if (time < moment()) {
            time.add(12, "hours");
        }

        // Do it again if we're still behind
        if (time < moment()) {
            time.add(12, "hours");
        }

        if (time.isValid()) {
            await createTrain(interaction, time, "lunch");
        } else {
            interaction.reply({
                content:
                    "Invalid date/time string. Make sure you follow the format example in the command help.",
                ephemeral: true,
            });
        }
    }
}

export { LunchTrain };
