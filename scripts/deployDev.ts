import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { commands } from '../src/commands/commandHandler';
import { exit } from 'process';
import config from '../config.json';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
});

client.once('ready', async (client: Client) => {
    const commandsData = [];
    for (const command of commands.values()) {
        commandsData.push(command.data.toJSON());
    }

    if (client.application) {
        await client.application.commands
            .set(commandsData, config.guildId)
            .then(() => console.log('Updated Dev commands'))
            .catch(console.error);
    } else console.log('No Client app');

    exit();
});

client.login(config.token);
