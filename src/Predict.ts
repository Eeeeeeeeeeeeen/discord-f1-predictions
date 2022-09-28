import { ApplicationCommandOptionType, ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "./Command";
import { createRequire } from "module";

export const Predict: Command = {
    name: "predict",
    description: "Allows you to make a prediction",
    type: ApplicationCommandType.ChatInput,
    options: [
        {name: "first", description: "Driver finishing 1st", type: ApplicationCommandOptionType.String, required: true, minLength: 3, maxLength: 3 },
        {name: "second", description: "Driver finishing 2nd", type: ApplicationCommandOptionType.String, required: true, minLength: 3, maxLength: 3 },
        {name: "third", description: "Driver finishing 3rd", type: ApplicationCommandOptionType.String, required: true, minLength: 3, maxLength: 3 }
    ],
    run: async(client: Client, interaction: CommandInteraction) => {      
        const response = await fetch('https://ergast.com/api/f1/2022/drivers.json', { method: 'GET'})
        const first = interaction.options.get('first')?.value as string;
        const second = interaction.options.get('second')?.value as string;
        const third = interaction.options.get('third')?.value as string;

        const errors: string [] = []
        var isDuplicate = false;

        var content: string = `<@${interaction.user.id}>ya selected 1. ${first} 2. ${second} 3. ${third}`;

        if(first === second || first === third || second === third)
        {
            isDuplicate = true;
            content = "You can't predict the same driver twice you goober!"
        }
        
        if(!response.ok) {
            content = "There was a problem making this prediction!"
        } else if(!isDuplicate) {
            const result = (await response.json()) as Drivers
            const codes = result.MRData.DriverTable.Drivers.map(x => x.code);
            
            if(!codes.includes(first)) 
            {
                errors.push(first)
            }
            if(!codes.includes(second)) 
            {
                errors.push(second)
            }
            if(!codes.includes(third)) 
            {
                errors.push(third)
            }
            if(errors.length > 0)
            {
                content = `The following drivers are invalid: ${errors}`
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content
        })
    }
}

export interface Drivers {
    MRData: MRData;
}

export interface MRData {
    xmlns:       string;
    series:      string;
    url:         string;
    limit:       string;
    offset:      string;
    total:       string;
    DriverTable: DriverTable;
}

export interface DriverTable {
    season:  string;
    Drivers: Driver[];
}

export interface Driver {
    driverId:        string;
    permanentNumber: string;
    code:            string;
    url:             string;
    givenName:       string;
    familyName:      string;
    dateOfBirth:     Date;
    nationality:     string;
}
