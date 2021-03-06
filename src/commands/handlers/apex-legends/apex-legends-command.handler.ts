import fetch, { Response } from 'node-fetch';
import { Message, RichEmbed } from 'discord.js';
import { Provides } from 'typescript-ioc';

import { CommandHandler } from '../comand.handler';
import { CommandLine } from '../../models/command-line';
import { PlayerShortInfoResult, PlayerShortInfo } from './models/player-short-info';

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
            .then((body: PlayerShortInfoResult) => {
                if (body && body.results) {
                    body.results.forEach(async (playerShortInfo: PlayerShortInfo) => {
                        this.getFullPlayerInfo(playerShortInfo)
                            .then((embedMessage) => this.message.channel.send(embedMessage));
                    });
                    return;
                }

                this.message.reply(`User ${this.commandLine.parameters[1]} on ${this.commandLine.parameters[0]} platform was not found.`);
            });
    }

    private async getFullPlayerInfo(playerShortInfo: PlayerShortInfo): Promise<RichEmbed> {
        return await fetch(`https://apextab.com/api/player.php?aid=${playerShortInfo.aid}`)
            .then((response: Response) => response.json())
            .then((bodyId: any) => {
                return new RichEmbed()
                    .setImage(playerShortInfo.avatar)
                    .setColor(0x00AE86)
                    .addField('UserName', playerShortInfo.name, true)
                    .addField('Platform', playerShortInfo.platform.toUpperCase(), true)
                    .addField('Preview Legend', playerShortInfo.legend, true)
                    .addField('Preview Legend Kills', playerShortInfo.kills || '>0', true)
                    .addField('Level', playerShortInfo.level || '>0', true)
                    .addField('Kill/Level', parseFloat(bodyId.skillratio) || 'Cannot be calculated', true)
                    .addField('Top#', parseFloat(bodyId.globalrank) || 'Is not placed yet' , true)
                    .setFooter(playerShortInfo.aid)
                    .setTimestamp();
            });
    }
}
