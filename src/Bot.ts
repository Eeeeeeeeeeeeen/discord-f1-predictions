import { Client } from "discord.js";
import ready from "./Ready";
import interactionCreate from './InteractionCreate'

console.log("Bot is starting...");

require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(token);
