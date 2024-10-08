import { Client, GatewayIntentBits, Partials, Interaction } from 'discord.js';
import { processButton } from './buttons/buttonHandler';
import { commands } from './commands/commandHandler';
import { setupHandler } from './util/trainLeaveHandler';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
});

client.once('ready', (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    setupHandler();
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    } else if (interaction.isButton()) {
        try {
            await processButton(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error processing your request!',
                ephemeral: true,
            });
        }
    }
});

client.login(process.env.BOTTOKEN);

export { client };
