import { Stats } from './roveSoDatabase';

namespace BotStats {
    export async function TrainLaunch(guildId: String, passengers: number) {
        await Stats.findOrCreate({ where: { guild: guildId } });
        await Stats.increment({ trainsDeparted: 1, passengersDeparted: passengers }, { where: { guild: guildId } });
    }

    export async function TrainCancel(guildId: String) {
        await Stats.findOrCreate({ where: { guild: guildId } });
        await Stats.increment({ canceledTrains: 1 }, { where: { guild: guildId } });
    }
}

export { BotStats };
