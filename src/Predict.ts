import { ApplicationCommandOptionType, ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "./Command";
import { addPrediction } from "./queries/AddPredictionQuery";
import { getPrediction } from "./queries/GetPredictionQuery";
import { editPrediction } from "./queries/EditPredictionQuery";
import { getTodaysSession } from "./queries/GetTodaysSessionQuery";

export const Predict: Command = {
    name: "predict",
    description: "Allows you to make a prediction",
    type: ApplicationCommandType.ChatInput,
    options: [
        { name: "first", description: "Driver finishing 1st", type: ApplicationCommandOptionType.String, required: true, minLength: 3, maxLength: 3 },
        { name: "second", description: "Driver finishing 2nd", type: ApplicationCommandOptionType.String, required: true, minLength: 3, maxLength: 3 },
        { name: "third", description: "Driver finishing 3rd", type: ApplicationCommandOptionType.String, required: true, minLength: 3, maxLength: 3 }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const session = await getTodaysSession();

        if(session.rowCount === 0)
        {
            throw new Error("There's not a session to predict today!");
        }

        if(hasSessionStarted(session.rows[0].time))
        {
            throw new Error("Today's session has already started, don't try cheat me!")
        }

        const response = await fetch('https://ergast.com/api/f1/2022/drivers.json', { method: 'GET' })

        if (!response.ok) {
            throw new Error("There was a problem making this prediction!")
        }

        const first = interaction.options.get('first')?.value as string;
        const second = interaction.options.get('second')?.value as string;
        const third = interaction.options.get('third')?.value as string;

        const errors: string[] = []

        if (first === second || first === third || second === third) {
            throw new Error("You can't predict the same driver twice you goober!")
        }

        const result = (await response.json()) as Drivers
        const codes = result.MRData.DriverTable.Drivers.map(x => x.code);

        if (!codes.includes(first)) {
            errors.push(first)
        }
        if (!codes.includes(second)) {
            errors.push(second)
        }
        if (!codes.includes(third)) {
            errors.push(third)
        }
        if (errors.length > 0) {
            throw new Error(`The following drivers are invalid: ${errors}`)
        }

        const existingPrediction = (await getPrediction(interaction.user.id, interaction.guildId as string, session.rows[0].id)).rowCount > 0

        if (existingPrediction) {
            editPrediction({ username: interaction.user.id, first: first, second: second, third: third, serverId: interaction.guildId as string, sessionId: session.rows[0].id })
        } else {
            addPrediction({ username: interaction.user.id, first: first, second: second, third: third, serverId: interaction.guildId as string, sessionId: session.rows[0].id })
        }
        var content: string = `<@${interaction.user.id}> selected 1. ${first} 2. ${second} 3. ${third} for the ${session.rows[0].racename} ${session.rows[0].name}`;

        await interaction.followUp({
            content
        })
    }
}

function hasSessionStarted(time: string):boolean {
    const dateNow = new Date()
    const t = time.split(":");

    const sessionTime = new Date();
    sessionTime.setUTCHours(Number(t[0]));
    sessionTime.setUTCMinutes(Number(t[1]))
    sessionTime.setUTCSeconds(Number(t[2]))

    return dateNow >= sessionTime;
}

export interface Drivers {
    MRData: MRData;
}

export interface MRData {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    DriverTable: DriverTable;
}

export interface DriverTable {
    season: string;
    Drivers: Driver[];
}

export interface Driver {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: Date;
    nationality: string;
}
