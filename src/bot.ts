import { Inject } from 'typescript-ioc';
import { Message } from 'discord.js';

import { ConfigurationService } from './configuration/configuration.service';
import { ConfigurationModel } from './configuration/configuration-model';
import { DiscordConstants } from './constants/discord-constants';
import { CommandFactory } from './commands/handlers/command.factory';
import { ClientWrapper } from './configuration/client.wrapper';

export class Bot {
    private readonly config: ConfigurationModel;

    constructor(
        @Inject private readonly clientWrapper: ClientWrapper,
        @Inject private readonly commandFactory: CommandFactory,
        @Inject readonly configurationService: ConfigurationService) {
        this.config = configurationService.getBotConfiguration();
    }

    public start(): void {
        this.clientWrapper.Client.on(DiscordConstants.Events.Ready, () => {
            this.clientWrapper.Client.user.setActivity(this.config.activity);
        });

        this.clientWrapper.Client.on(DiscordConstants.Events.Message, async (message: Message) => {
            if (message.author.id === this.clientWrapper.Client.user.id) {
                return;
            }

            await this.commandFactory.Create(message).handle();
        });

        process.on(DiscordConstants.Events.Exit, () => {
            this.clientWrapper.Client.destroy();
        });

        this.clientWrapper.Client.login(this.config.token);
    }
}
