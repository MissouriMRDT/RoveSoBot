import { Client, GatewayIntentBits, Partials, ApplicationCommandDataResolvable } from 'discord.js';
import { commands } from '../src/commands/commandHandler';
import { exit } from 'process';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
});

client.once('ready', async (client: Client) => {
    const commandsData: ApplicationCommandDataResolvable[] = [];
    for (const command of commands.values()) {
        if (!command.debug) commandsData.push(command.data.toJSON());
    }

    if (client.application) {
        await client.application.commands
            .set(commandsData)
            .then(() => console.log('Updated Global commands'))
            .catch(console.error);
    } else console.log('No Client app');

    exit();
});

client.login(process.env.BOTTOKEN!);
