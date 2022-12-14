import { Client, Interaction,CacheType, CommandInteraction } from "discord.js";
import { Commands } from "./Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);

    await interaction.deferReply({ephemeral: interaction.commandName === 'get-predictions' ? true : false});

    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    if(interaction.guildId === null)
    {
        interaction.followUp({content: "Don't DM me you rat!"})
        return;
    }

    try {
        await slashCommand.run(client, interaction);
    } catch(e) {
        const error = e as Error;

        interaction.followUp({ephemeral: true, content:  error.message})
    }
}; 
