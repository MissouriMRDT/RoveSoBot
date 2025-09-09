import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    GuildTextBasedChannel,
    InteractionCallbackResponse,
    InteractionReplyOptions,
    MessageFlags,
    User,
} from 'discord.js';
import { client } from '..';
import { Trains } from '../database/roveSoDatabase';
import { trainCancelMsg } from '../util/trainMessageGen';
import moment from 'moment';
import { BotStats } from '../database/botStats';

async function cancelTrain(interaction: ButtonInteraction) {
    const train = await Trains.findOne({
        where: {
            message: interaction.message.id,
            channel: interaction.channelId,
            guild: interaction.guildId,
        },
    });

    if (train) {
        const conductor = client.users.cache.get(train.get('conductor') as string);

        const guild = client.guilds.cache.get(train.get('guild') as string);
        const channel = guild?.channels.cache.get(train.get('channel') as string);

        const message = await (channel as GuildTextBasedChannel).messages.fetch(train.get('message') as string);

        const data: { joined: string[] } = JSON.parse(JSON.stringify(train.get('members') as any));

        const joinedUnfiltered = data.joined.map((id) => {
            const user = client.users.cache.get(id);
            if (user) return user;
        });
        // Filter out undefined users. This shouldn't ever happen, but TS gets mad if we don't do this.
        const joinedFiltered = joinedUnfiltered.filter((item: User | undefined): item is User => !!item);
        const dest = train.get('place') as string;
        const type = train.get('trainType') as 'lunch' | 'party';

        const time = moment.unix(train.get('time') as number);

        if (interaction.user.id == conductor?.id) {
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId('denyCancelTrain').setLabel('No').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('confirmCancelTrain').setLabel('Yes').setStyle(ButtonStyle.Danger)
            );

            const response = interaction.reply({
                content: 'Are you sure you want to cancel this train? This will notify all joined members.',
                flags: MessageFlags.Ephemeral,
                components: [row],
                withResponse: true,
            });

            response
                .then((value: InteractionCallbackResponse<boolean>) => {
                    value.resource?.message
                        ?.awaitMessageComponent({ filter: (i) => i.user.id === interaction.user.id, time: 60000 })
                        .then((componentValue) => {
                            if (componentValue.customId == 'confirmCancelTrain') {
                                message.reply({
                                    content: trainCancelMsg(conductor, joinedFiltered, dest, type, time),
                                });

                                Trains.destroy({
                                    where: {
                                        id: train.get('id'),
                                    },
                                })
                                    .then(() =>
                                        interaction.editReply({
                                            content: 'Canceled train',
                                            components: [],
                                        })
                                    )
                                    .catch(() => interaction.editReply('An error occurred when canceling train!'));
                                BotStats.TrainCancel(train.get('guild') as string);
                            } else if (componentValue.customId == 'denyCancelTrain') {
                                interaction.deleteReply();
                            }
                        })
                        .catch(() =>
                            interaction.editReply({
                                content: 'Confirmation not received within 1 minute. Not cancelling train.',
                                components: [],
                            })
                        );
                })
                .catch(() =>
                    interaction.editReply({
                        content: 'Error canceling train!',
                    })
                );
        } else {
            interaction.reply({
                content: 'Only the conductor can cancel a train!',
                flags: MessageFlags.Ephemeral,
            });
        }
    } else {
        interaction.reply({
            content: 'That train already left!',
            flags: MessageFlags.Ephemeral,
        });
    }
}

export { cancelTrain };
