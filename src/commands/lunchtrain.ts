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

        setInterval(async () => {
            const timeNow = moment().unix();
            const leavingTrains = await Trains.findAll({
                where: {
                    time: {
                        [Op.lte]: timeNow,
                    },
                },
            });

            leavingTrains.forEach(async (train) => {
                const guild = client.guilds.cache.get(
                    train.get("guild") as string
                );
                const channel = guild?.channels.cache.get(
                    train.get("channel") as string
                );

                const message = await (
                    channel as GuildTextBasedChannel
                ).messages.fetch(train.get("message") as string);

                let tags = "";
                const data: { joined: string[] } = JSON.parse(
                    JSON.stringify(train.get("members") as any)
                );
                data.joined.push(train.get("conductor") as string);
                if (data.joined.length == 1) {
                    tags += `${client.users.cache.get(data.joined[0])}`;
                } else {
                    data.joined.map((id, index) => {
                        if (
                            index != data.joined.length - 1 &&
                            client.users.cache.get(id)
                        )
                            return `${client.users.cache.get(id)}, `;
                        else return `and ${client.users.cache.get(id)}`;
                    });
                }

                message.reply(
                    "All Aboard! The train is leaving the station. " +
                        tags +
                        (tags.length > 0 ? " should get going!" : "")
                );
                await Trains.destroy({
                    where: {
                        id: train.get("id"),
                    },
                });
            });
        }, 60000);
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

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("joinTrain")
                .setLabel("Join the Train!")
                .setStyle("PRIMARY")
        );

        await interaction.reply({
            content: ` ${
                interaction.user
            } created a Lunch Train to ${interaction.options.getString(
                "location"
            )} at ${time.format("h:mm a")}. Join up!`,
            components: [row],
        });

        const reply = await interaction.fetchReply();
        const train = await Trains.create({
            trainType: "lunch",
            //We know it has a guildId property since we've checked that it's in a guild
            guild: interaction.guildId!,
            channel: interaction.channelId,
            members: { joined: [] },
            conductor: interaction.user.id,
            time: time.unix(),
            message: reply.id,
            place: interaction.options.getString("location"),
        });
        train.save();
    }
}

export { LunchTrain };
