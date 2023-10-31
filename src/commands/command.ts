import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

abstract class Command {
    data: SlashCommandBuilder;
    debug: boolean;

    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
    constructor(data: SlashCommandBuilder, debug: boolean) {
        this.data = data;
        this.debug = debug;
    }
}

export { Command };
