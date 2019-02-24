import { Client, Message } from 'discord.js';
import { Provides } from 'typescript-ioc';

import { CommandLine } from '../../models/command-line';
import { CommandHandler } from '../comand.handler';

@Provides (CommandHandler)
export class KekkingCommandHandler extends CommandHandler {
    private readonly defaultAnswer: string = 'kok';

    constructor(
        private readonly client: Client,
        private readonly message: Message,
        private readonly commandLine: CommandLine) {
        super();
    }

    public async handle(): Promise<void> {
        if (this.commandLine.parameters && this.commandLine.parameters.length) {
            const userName = this.commandLine.parameters[0].toLowerCase();

            if (this.commandLine.parameters.length === 1) {
                this.sendMessageToUser(userName, this.defaultAnswer);
                return;
            }

            this.sendMessageToUser(userName, this.commandLine.parameters.splice(1).join(' '));
        } else {
            this.message.reply(this.defaultAnswer);
        }

        return Promise.resolve();
    }

    private sendMessageToUser(userName: string, messageContent: string): void {
        const user = this.client.users
            .find((u) => u.username.toLowerCase().includes(userName));

        if (user) {
            this.message.channel.send(`<@${user.id}>, ${messageContent}`);
            return;
        }

        this.message.reply(messageContent);
    }
}
