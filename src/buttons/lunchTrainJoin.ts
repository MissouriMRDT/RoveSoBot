import { ButtonInteraction } from "discord.js";
import moment from "moment";
import { client } from "..";
import { Trains } from "../database/roveSoDatabase";

async function joinTrain(interaction: ButtonInteraction) {
    const train = await Trains.findOne({
        where: {
            message: interaction.message.id,
            channel: interaction.channelId,
            guild: interaction.guildId,
        },
    });

    if (train) {
        const data: { joined: string[] } = JSON.parse(
            JSON.stringify(train.get("members") as any)
        );
        if (
            !data.joined.includes(interaction.user.id) &&
            (train.get("conductor") as string) != interaction.user.id
        ) {
            data.joined.push(interaction.user.id);
            train.set({ members: data });
            await train.save();

            interaction.update({
                content: ` ${client.users.cache.get(
                    train.get("conductor") as string
                )} created a Lunch Train to ${
                    train.get("place") as string
                } at ${moment
                    .unix(train.get("time") as number)
                    .format("h:mm a")}. ${data.joined.map((id, index) => {
                    if (data.joined.length == 1)
                        return `${client.users.cache.get(id)} has`;
                    if (index != data.joined.length - 1)
                        return `${client.users.cache.get(id)}, `;
                    else return `and ${client.users.cache.get(id)} have`;
                })} joined; Hop in!`,
            });
        } else {
            interaction.reply({
                content: "You've already joined!",
                ephemeral: true,
            });
        }
    } else {
        console.error("Unable to find train for interaction: ", interaction);
    }
}

export { joinTrain };
