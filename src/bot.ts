import { Inject } from 'typescript-ioc';
import { Client, Message } from 'discord.js';

import { ConfigurationService } from './configuration/configuration.service';
import { ConfigurationModel } from './configuration/configuration-model';
import { DiscordConstants } from './constants/discord-constants';
import { CommandFactory } from './commands/handlers/command.factory';

export class Bot {
    private readonly config: ConfigurationModel;

    constructor(
        @Inject private readonly client: Client,
        @Inject private readonly commandFactory: CommandFactory,
        @Inject readonly configurationService: ConfigurationService) {
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

            await this.commandFactory.Create(message);
        });

        process.on(DiscordConstants.Events.Exit, () => {
            this.client.destroy();
        });

        this.client.login(this.config.token);
    }
}
