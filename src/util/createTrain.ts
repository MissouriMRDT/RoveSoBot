import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import moment from 'moment';
import { Trains } from '../database/roveSoDatabase';
import { updateMsg } from './trainMessageGen';

async function createTrain(interaction: ChatInputCommandInteraction, time: moment.Moment, type: 'party' | 'lunch') {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('joinTrain').setLabel('Join/Leave the Train!').setStyle(ButtonStyle.Primary)
    );

    const dest = interaction.options.getString('location');
    if (dest)
        await interaction.reply({
            content: updateMsg(interaction.user, [], dest, time, type),
            components: [row],
        });
    else
        interaction.reply({
            content: 'Unable to create train, no destination given.',
            ephemeral: true,
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
        place: interaction.options.getString('location'),
    });
    train.save();
}

export { createTrain };
