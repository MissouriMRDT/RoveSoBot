import fs from "fs";
import path from "path";
import { Client, Intents, Collection, Interaction } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
import { commands } from "./commands/commandHandler";
import config from "../config.json";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.login(config.token);
