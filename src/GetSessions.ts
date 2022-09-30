import { ApplicationCommandOptionType, ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "./Command";
import { createRequire } from "module";
import { getSessions } from "./ConnectDb";

export const GetSessions: Command = {
    name: "get-sessions",
    description: "Gets all sessions",
    type: ApplicationCommandType.ChatInput,
    run: async(client: Client, interaction: CommandInteraction) => {      
        const result = (await getSessions());

        const sessions = result.rows[0];

        const reply = `${sessions.racename} ${sessions.date} ${sessions.time}`

        await interaction.followUp({
            ephemeral: true,
            content: reply
        })
    }
}
