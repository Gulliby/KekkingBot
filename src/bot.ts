import fetch, { Response } from 'node-fetch';
import { Inject } from 'typescript-ioc';
import { Client, Message, RichEmbed } from 'discord.js';

import { ConfigurationService } from './configuration/configuration.service';
import { ConfigurationModel } from './configuration/configuration-model';
import { DiscordConstants } from './constants/discord-constants';
import { CommandLine } from './commands/models/command-line';

export class Bot {
    private readonly client: Client;
    private readonly config: ConfigurationModel;

    constructor(@Inject configurationService: ConfigurationService) {
        this.client = new Client();
        this.config = configurationService.getBotConfiguration();
    }

    public start(): void {
        this.client.on(DiscordConstants.Events.Ready, () => {
            this.client.user.setActivity(this.config.activity);
        });

        this.client.on(DiscordConstants.Events.Message, async (message: Message) => {
            if (message.author.id === this.client.user.id) {
                return;
            }

            const commandLine = this.parseCommandLine(message.content);
            this.getPrefixCommands(commandLine.prefix)(message, commandLine);
        });

        process.on(DiscordConstants.Events.Exit, () => {
            this.client.destroy();
        });

        this.client.login(this.config.token);
    }

    private parseCommandLine(commandLine: string): CommandLine {
        const splittedCommands = commandLine.split(' ');

        return {
            parameters: splittedCommands.splice(1),
            prefix: splittedCommands[0]
        };
    }

    private getPrefixCommands(prefix: string): any {
        const commandsMap: Map<string, any> =
            new Map([
                [this.config.prefix, this.keksCommands ],
                [`${this.config.prefix}n`, this.apexCommands ]
            ]);

        return commandsMap.get(prefix).bind(this);
    }
}
