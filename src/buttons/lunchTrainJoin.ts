import { ButtonInteraction, User } from 'discord.js';
import moment from 'moment';
import { client } from '..';
import { Trains } from '../database/roveSoDatabase';
import { updateMsg } from '../util/trainMessageGen';

async function joinTrain(interaction: ButtonInteraction) {
    const train = await Trains.findOne({
        where: {
            message: interaction.message.id,
            channel: interaction.channelId,
            guild: interaction.guildId,
        },
    });

    if (train) {
        const data: { joined: string[] } = JSON.parse(JSON.stringify(train.get('members') as any));

        if (!data.joined.includes(interaction.user.id) && (train.get('conductor') as string) != interaction.user.id) {
            // User is not in train and is not conductor
            // Joins train
            data.joined.push(interaction.user.id);
            train.set({ members: data });
            await train.save();
            const conductor = client.users.cache.get(train.get('conductor') as string);
            const joinedUnfiltered = data.joined.map((id) => {
                const user = client.users.cache.get(id);
                if (user) return user;
            });
            // Filter out undefined users. This shouldn't ever happen, but TS gets mad if we don't do this.
            const joinedFiltered = joinedUnfiltered.filter((item: User | undefined): item is User => !!item);
            const time = moment.unix(train.get('time') as number);
            const dest = train.get('place') as string;
            const type = train.get('trainType') as 'lunch' | 'party';

            if (conductor) {
                interaction.update({
                    content: updateMsg(conductor, joinedFiltered, dest, time, type),
                });
            } else {
                interaction.reply({
                    content: 'An error occurred!',
                    ephemeral: true,
                });
            }
        } else if (
            data.joined.includes(interaction.user.id) &&
            (train.get('conductor') as string) != interaction.user.id
        ) {
            // User is in train and not conductor
            // Leaves Train
            data.joined.splice(data.joined.indexOf(interaction.user.id), 1);
            train.set({ members: data });
            await train.save();

            const conductor = client.users.cache.get(train.get('conductor') as string);
            const joinedUnfiltered = data.joined.map((id) => {
                const user = client.users.cache.get(id);
                if (user) return user;
            });
            // Filter out undefined users. This shouldn't ever happen, but TS gets mad if we don't do this.
            const joinedFiltered = joinedUnfiltered.filter((item: User | undefined): item is User => !!item);
            const time = moment.unix(train.get('time') as number);
            const dest = train.get('place') as string;
            const type = train.get('trainType') as 'lunch' | 'party';

            if (conductor) {
                interaction.update({
                    content: updateMsg(conductor, joinedFiltered, dest, time, type),
                });
            } else {
                interaction.reply({
                    content: 'An error occurred!',
                    ephemeral: true,
                });
            }
        } else {
            // Else user is conductor, no action.
            interaction.reply({
                content: "The conductor can't leave",
                ephemeral: true,
            });
        }
    } else {
        interaction.reply({
            content: 'That train already left',
            ephemeral: true,
        });
    }
}

export { joinTrain };
