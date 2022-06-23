import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
import { Client } from "discord.js";
import { commands } from "../commands/commandHandler";

module.exports = {
  name: "ready",
  once: true,
  execute(client: Client) {
    const commandsData: Array<RESTPostAPIApplicationCommandsJSONBody> = [];
    for (const command of commands.values()) {
      commandsData.push(command.data.toJSON());
    }
    const guild = client.guilds.cache.get("320716171982667788");
    if (guild) guild.commands.set(commandsData).catch((e) => console.log(e));

    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
