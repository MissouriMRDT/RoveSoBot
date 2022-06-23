import fs from "fs";
import path from "path";
import { Client, Intents, Collection } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";

const configJSON = path.join(__dirname, "../../config.json");
let config: any = {};
if (fs.existsSync(configJSON)) {
  config = JSON.parse(fs.readFileSync(configJSON).toString());
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.token);

export { config };
