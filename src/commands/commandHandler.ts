import { Collection } from "discord.js";
import { Command } from "./command";
import { LunchTrain } from "./lunchtrain";
import { Ping } from "./ping";

const commands: Collection<string, Command> = new Collection();

const PingCommand = new Ping();
commands.set(PingCommand.data.name, PingCommand);

const LunchTrainCommand = new LunchTrain();
commands.set(LunchTrainCommand.data.name, LunchTrainCommand);

export { commands, Command };
