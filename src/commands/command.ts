import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";

abstract class Command {
  data: SlashCommandBuilder;

  abstract execute(interaction: CommandInteraction): Promise<void>;
  constructor(data: SlashCommandBuilder) {
    this.data = data;
  }
}

export { Command };
