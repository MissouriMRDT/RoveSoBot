import { ButtonInteraction } from 'discord.js';
import { Trains } from '../database/roveSoDatabase';
import { joinTrain } from './lunchTrainJoin';

async function processButton(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case 'joinTrain': {
            await joinTrain(interaction);
            break;
        }
    }
}

export { processButton };
