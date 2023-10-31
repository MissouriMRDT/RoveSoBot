import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BotStats } from '../database/botStats';
import { Stats } from '../database/roveSoDatabase';
import { Command } from './command';

class CommandStats extends Command {
    constructor() {
        super(new SlashCommandBuilder().setName('stats').setDescription("Shows this server's bot stats"), false);
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        const guildStats = await Stats.findOne({
            where: {
                guild: interaction.guildId,
            },
        });

        console.log(guildStats?.toJSON());

        if (guildStats !== null) {
            const embed = new EmbedBuilder()
                .setTitle('Server Stats')
                .setColor(0x990000)
                .addFields([
                    {
                        name: 'Trains Departed',
                        value: ('' + guildStats.get('trainsDeparted')) as string,
                        inline: true,
                    },
                    {
                        name: 'Passengers Departed',
                        value: ('' + guildStats.get('PassengersDeparted')) as string,
                        inline: true,
                    },
                ]);

            interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply("I couldn't find any stats for this server!");
        }
    }
}

export { CommandStats };
