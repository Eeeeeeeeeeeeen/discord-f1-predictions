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

        const sessions = result.rows[0].name;

        const reply = `${sessions}\n${sessions}`

        await interaction.followUp({
            ephemeral: true,
            content: reply
        })
    }
}
