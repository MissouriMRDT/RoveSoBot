import { Collection } from "discord.js";
import { Command } from "./command";
import { LunchTrain } from "./lunchtrain";
import { PartyTrain } from "./partytrain";
import { Ping } from "./ping";
import { CommandStats } from "./stats";

const commands: Collection<string, Command> = new Collection();

const PingCommand = new Ping();
commands.set(PingCommand.data.name, PingCommand);

const LunchTrainCommand = new LunchTrain();
commands.set(LunchTrainCommand.data.name, LunchTrainCommand);

const PartyTrainCommand = new PartyTrain();
commands.set(PartyTrainCommand.data.name, PartyTrainCommand);

const StatsCommand = new CommandStats();
commands.set(StatsCommand.data.name, StatsCommand);

export { commands, Command };
