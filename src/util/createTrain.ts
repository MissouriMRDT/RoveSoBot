import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import moment from "moment";
import { Trains } from "../database/roveSoDatabase";

async function createTrain(
    interaction: CommandInteraction,
    time: moment.Moment,
    type: "party" | "lunch"
) {
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("joinTrain")
            .setLabel("Join/Leave the Train!")
            .setStyle("PRIMARY")
    );

    await interaction.reply({
        content: ` ${interaction.user} created a ${
            type == "lunch" ? "Lunch Train" : "Party Bus"
        } to ${interaction.options.getString("location")} at ${time.format(
            "h:mm a"
        )} on ${time.format("MM/DD/YYYY")}. Join up!`,
        components: [row],
    });

    const reply = await interaction.fetchReply();
    const train = await Trains.create({
        trainType: type,
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

export { createTrain };
