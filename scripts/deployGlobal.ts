import fs from "fs";
import path from "path";
import { Client, Intents } from "discord.js";
import { commands } from "../src/commands/commandHandler";
import { exit } from "process";
import config from "../config.json";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async (client: Client) => {
    const commandsData = [];
    for (const command of commands.values()) {
        if (!command.debug) commandsData.push(command.data.toJSON());
    }

    if (client.application) {
        await client.application.commands
            .set(commandsData)
            .then(() => console.log("Updated Global commands"))
            .catch(console.error);
    } else console.log("No Client app");

    exit();
});

client.login(config.token);
