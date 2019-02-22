import { Client, Message } from 'discord.js';

import { CommandLine } from '../../models/command-line';
import { ICommandHandler } from '../icomand.handler';

export class KekkingCommandHandler implements ICommandHandler {
    private readonly defaultAnswer: string = 'kok';

    constructor(
        public client: Client,
        public message: Message) { }

    public handle(commandLine: CommandLine): Promise<void> {
        if (commandLine.parameters && commandLine.parameters.length) {
            const userName = commandLine.parameters[0].toLowerCase();

            if (commandLine.parameters.length === 1) {
                this.sendMessageToUser(userName, this.defaultAnswer);
            }

            this.sendMessageToUser(userName, commandLine.parameters.splice(1).join(' '));
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