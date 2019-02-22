import fetch, { Response } from 'node-fetch';
import { Inject } from 'typescript-ioc';
import { Client, Message, RichEmbed } from 'discord.js';

import { ConfigurationService } from './configuration/configuration.service';
import { ConfigurationModel } from './configuration/configuration-model';

export class KekkingBot {
    private readonly client: Client;
    private readonly config: ConfigurationModel;

    constructor(@Inject configurationService: ConfigurationService) {
        this.client = new Client();
        this.config = configurationService.getBotConfiguration();
    }

    public start(): void {
        this.client.on('ready', () => {
            this.client.user.setActivity(this.config.activity);
        });

        this.client.on('message', async (message: Message) => {
            if (message.author.id === this.client.user.id) {
                return;
            }

            const commandLine = this.parseCommandLine(message.content);
            this.getPrefixCommands(commandLine.prefix)(message, commandLine);
        });

        process.on('exit', () => {
            this.client.destroy();
        });

        this.client.login(this.config.token);
    }

    private parseCommandLine(commandLine: string): { parameters: string[], prefix: string } {
        const splittedCommands = commandLine.split(' ');

        return {
            parameters: splittedCommands.splice(1),
            prefix: splittedCommands[0]
        };
    }

    private async apexCommands(message: Message, commandLine: { parameters: string[], prefix: string }): Promise<void> {
        if (commandLine.parameters.length !== 2) {
            message.reply('First parameter should be [Platform] and the second [UserName].');
            return;
        }

        await fetch(`https://apextab.com/api/search.php?platform=${commandLine.parameters[0]}&search=${commandLine.parameters[1]}`)
            .then((response: Response) => response.json())
            .then((body: any) => {
                if (body && body.results) {
                    body.results.forEach(async (player: any) => {
                        await fetch(`https://apextab.com/api/player.php?aid=${player.aid}`)
                            .then((response: Response) => response.json())
                            .then((bodyId: any) => {
                                const embed = new RichEmbed()
                                    .setImage(player.avatar)
                                    .setColor(0x00AE86)
                                    .addField('UserName', player.name, true)
                                    .addField('Platform', player.platform.toUpperCase(), true)
                                    .addField('Preview Legend', player.legend, true)
                                    .addField('Preview Legend Kills', parseFloat(player.kills) || '>0', true)
                                    .addField('Level', parseFloat(player.level) || '>0', true)
                                    .addField('Kill/Level', parseFloat(bodyId.skillratio) || 'Cannot be calculated', true)
                                    .addField('Top#', parseFloat(bodyId.globalrank) || 'Is not placed yet' , true)
                                    .setFooter(player.aid)
                                    .setTimestamp();
                                message.channel.send(embed);
                            });
                    });
                    return;
                }

                message.reply(`User ${commandLine.parameters[1]} on ${commandLine.parameters[0]} platform was not found.`);
            });
    }

    private keksCommands(message: Message, commandLine: { parameters: string[], prefix: string }): void {
        if (commandLine.parameters && commandLine.parameters.length) {
            if (commandLine.parameters.length === 1) {
                this.sendMessageToUser(message, commandLine.parameters[0].toLowerCase(), 'kok');
            } else {
                this.sendMessageToUser(message, commandLine.parameters[0].toLowerCase(), commandLine.parameters.splice(1).join(' '));
            }
            return;
        }

        message.reply('kok');
    }

    private getPrefixCommands(prefix: string): any {
        const commandsMap: Map<string, any> =
            new Map([
                ['!kek', this.keksCommands ],
                ['!kekn', this.apexCommands ]
            ]);

        return commandsMap.get(prefix).bind(this);
    }

    private sendMessageToUser(message: any, userName: any, messageContent: any): void {
        const user = this.client.users
            .find((u) => u.username.toLowerCase().includes(userName));

        if (user) {
            message.channel.send(`<@${user.id}>, ${messageContent}`);
            return;
        }

        message.reply(messageContent);
    }
}
