import {
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";

abstract class Command {
    data: SlashCommandBuilder;
    debug: boolean;

    abstract execute(interaction: CommandInteraction): Promise<void>;
    constructor(data: SlashCommandBuilder, debug: boolean) {
        this.data = data;
        this.debug = debug;
    }
}

export { Command };
