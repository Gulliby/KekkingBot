import { Provides } from 'typescript-ioc';

import { CommandHandler } from '../comand.handler';
import { CommandLine } from '../../models/command-line';

@Provides (CommandHandler)
export class DefaultCommandHandler extends CommandHandler {
    public async handle(commandLine: CommandLine): Promise<void> {
        return Promise.resolve();
    }
}
