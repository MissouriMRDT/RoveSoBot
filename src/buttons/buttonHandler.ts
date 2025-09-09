import { ButtonInteraction } from 'discord.js';
import { Trains } from '../database/roveSoDatabase';
import { joinTrain } from './lunchTrainJoin';
import { cancelTrain } from './cancelTrain';

async function processButton(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case 'joinTrain': {
            await joinTrain(interaction);
            break;
        }
        case 'cancelTrain': {
            await cancelTrain(interaction);
            break;
        }
    }
}

export { processButton };
