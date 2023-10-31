import { GuildTextBasedChannel, User } from 'discord.js';
import moment from 'moment';
import { Op } from 'sequelize';
import { Trains } from '../database/roveSoDatabase';
import { BotStats } from '../database/botStats';
import { client } from '../index';
import { trainLeaveMsg } from './trainMessageGen';

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
                const guild = client.guilds.cache.get(train.get('guild') as string);
                const channel = guild?.channels.cache.get(train.get('channel') as string);

                const message = await (channel as GuildTextBasedChannel).messages.fetch(train.get('message') as string);

                const data: { joined: string[] } = JSON.parse(JSON.stringify(train.get('members') as any));

                const conductor = client.users.cache.get(train.get('conductor') as string);
                const joinedUnfiltered = data.joined.map((id) => {
                    const user = client.users.cache.get(id);
                    if (user) return user;
                });
                // Filter out undefined users. This shouldn't ever happen, but TS gets mad if we don't do this.
                const joinedFiltered = joinedUnfiltered.filter((item: User | undefined): item is User => !!item);
                const dest = train.get('place') as string;
                const type = train.get('trainType') as 'lunch' | 'party';
                if (conductor)
                    message
                        .reply(trainLeaveMsg(conductor, joinedFiltered, dest, type))
                        .catch((e) => console.log('Error sending reply to lunchtrain'));

                await BotStats.TrainLaunch(train.get('guild') as string, data.joined.length);

                await Trains.destroy({
                    where: {
                        id: train.get('id'),
                    },
                });
            } catch (e) {
                console.log(`Error Launching train: Aborting. Error: ${e}`);
                await Trains.destroy({
                    where: {
                        id: train.get('id'),
                    },
                });
            }
        });
    }, 60000);
}

export { setupHandler };
