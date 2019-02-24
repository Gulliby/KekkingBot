import fetch, { Response } from 'node-fetch';
import { Client, Message, RichEmbed } from 'discord.js';
import { Provides } from 'typescript-ioc';

import { CommandHandler } from '../comand.handler';
import { CommandLine } from '../../models/command-line';

@Provides (CommandHandler)
export class ApexLegendsCommandHandler extends CommandHandler {
    constructor(
        private readonly message: Message,
        private readonly commandLine: CommandLine) {
        super();
    }

    public async handle(): Promise<void> {
        if (this.commandLine.parameters.length !== 2) {
            this. message.reply('First parameter should be [Platform] and the second [UserName].');
            return;
        }

        return await fetch(`https://apextab.com/api/search.php?platform=${this.commandLine.parameters[0]}&search=${this.commandLine.parameters[1]}`)
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
                                this.message.channel.send(embed);
                            });
                    });
                    return;
                }

                this.message.reply(`User ${this.commandLine.parameters[1]} on ${this.commandLine.parameters[0]} platform was not found.`);
            });
    }
}
