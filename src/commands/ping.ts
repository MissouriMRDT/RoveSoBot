import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from './command';

class Ping extends Command {
    constructor() {
        super(new SlashCommandBuilder().setName('ping').setDescription('Replies with something!'), false);
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Pong!');
    }
}

export { Ping };
