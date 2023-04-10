import { GuildTextBasedChannel } from "discord.js";
import moment from "moment";
import { Op } from "sequelize";
import { Trains } from "../database/roveSoDatabase";
import { BotStats } from "../database/botStats";
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
            try {
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

                if ((train.get("trainType") as string) == "lunch") {
                    message
                        .reply(
                            "All Aboard. Time for food! " +
                                tags +
                                (tags.length > 0 ? " meet " : "Meet ") +
                                `at ${train.get("place") as string}!`
                        )
                        .catch((e) =>
                            console.log("Error sending reply to lunchtrain")
                        );
                } else if ((train.get("trainType") as string) == "party") {
                    message
                        .reply(
                            "Time to party! " +
                                tags +
                                (tags.length > 0 ? " meet " : "Meet ") +
                                `at ${train.get("place") as string}!`
                        )
                        .catch((e) =>
                            console.log("Error sending reply to partytrain")
                        );
                }

                await BotStats.TrainLaunch(
                    train.get("guild") as string,
                    data.joined.length
                );

                await Trains.destroy({
                    where: {
                        id: train.get("id"),
                    },
                });
            } catch (e) {
                console.log(`Error Launching train: Aborting. Error: ${e}`);
                await Trains.destroy({
                    where: {
                        id: train.get("id"),
                    },
                });
            }
        });
    }, 60000);
}

export { setupHandler };
