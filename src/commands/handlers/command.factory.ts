import { Message } from 'discord.js';
import { Inject } from 'typescript-ioc';

import { CommandLine } from '../models/command-line';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfigurationModel } from '../../configuration/configuration-model';
import { KekkingCommandHandler } from './kekking/kekking-command.handler';
import { ApexLegendsCommandHandler } from './apex-legends/apex-legends-command.handler';
import { CommandHandler } from './comand.handler';
import { DefaultCommandHandler } from './default/default-command.handler';
import { ClientWrapper } from './../../configuration/client.wrapper';

// TODO: should be refactore (tried), using IOC-container
export class CommandFactory {
    private readonly config: ConfigurationModel;

    constructor(
        @Inject private readonly clientWrapper: ClientWrapper,
        @Inject readonly configurationService: ConfigurationService) {
            this.config = configurationService.getBotConfiguration();
        }

    public Create(message: Message): CommandHandler {
        const commandLine = this.parseCommandLine(message.content);

        switch (commandLine.prefix) {
            case this.config.prefix: {
               return new KekkingCommandHandler(this.clientWrapper.Client, message, commandLine);
            }
            case `${this.config.prefix}n`: {
                return new ApexLegendsCommandHandler(message, commandLine);
            }
        }

        return new DefaultCommandHandler();
    }

    private parseCommandLine(commandLine: string): CommandLine {
        const splittedCommands = commandLine.split(' ');

        return {
            parameters: splittedCommands.splice(1),
            prefix: splittedCommands[0].toLowerCase()
        };
    }
}
