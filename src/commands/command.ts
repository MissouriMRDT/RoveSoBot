import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

abstract class Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    debug: boolean;

    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
    constructor(data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder, debug: boolean) {
        this.data = data;
        this.debug = debug;
    }
}

export { Command };
