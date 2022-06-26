import { GuildTextBasedChannel } from "discord.js";
import moment from "moment";
import { Op } from "sequelize";
import { Trains } from "../database/roveSoDatabase";
import { client } from "../index";

async function setupHandler() {
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
            const guild = client.guilds.cache.get(train.get("guild") as string);
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

            if ((train.get("trainType") as string) == "lunch") {
                message.reply(
                    "All Aboard! Time for lunch. " +
                        tags +
                        (tags.length > 0
                            ? ` meet at ${train.get("place") as string}!`
                            : "")
                );
            } else if ((train.get("trainType") as string) == "party") {
                message.reply(
                    "Time to party! " +
                        tags +
                        (tags.length > 0
                            ? ` meet at ${train.get("place") as string}!`
                            : "")
                );
            }

            await Trains.destroy({
                where: {
                    id: train.get("id"),
                },
            });
        });
    }, 60000);
}

export { setupHandler };
