import { ApplicationCommandOptionType, ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "./Command";
import { getPredictions } from "./queries/GetPredictionsQuery";
import { getTodaysSession } from "./queries/GetTodaysSessionQuery";

export const GetPredictions: Command = {
    name: "get-predictions",
    description: "Gets all predictions for Singapore session",
    type: ApplicationCommandType.ChatInput,
    // options: [
    //     { name: "type", description: "Which type of session are you looking for?",
    //      type: ApplicationCommandOptionType.String, required: true, minLength: 1, maxLength: 1, choices: [{name: 'Quali', value: '0'}, {name:'Race', value: '1'}] }
    // ],
    run: async(client: Client, interaction: CommandInteraction) => {      
        // const type = interaction.options.get('type')?.value as number;
        
        const todaysSession = await getTodaysSession();
        if(todaysSession.rowCount === 0) 
        {
            throw new Error("There's no event on today!")
        }
        const result = (await getPredictions(todaysSession.rows[0].id));

        if(result.rowCount === 0)
        {
            throw new Error("No predictions");
        }

        var lines: string = "";

        result.rows.forEach(prediction => {
            lines += `\n<@${prediction.user_id}> - 1. ${prediction.first} 2. ${prediction.second} 3. ${prediction.third}`
        });

        await interaction.editReply({
            content: lines,
        })
    }
}
