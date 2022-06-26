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

class PartyTrain extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("partytrain")
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
                .setDescription("Starts a Party Train")
        );
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!interaction.inGuild()) {
            interaction.reply("This command can only be used in servers");
            return;
        } else if (!interaction.channel?.isText()) {
            interaction.reply("This command can only be used in text channels");
            return;
        }

        const time = moment(
            interaction.options.getString("time"),
            ["h:m", "h:m a"],
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

        await createTrain(interaction, time, "party");
    }
}

export { PartyTrain };
