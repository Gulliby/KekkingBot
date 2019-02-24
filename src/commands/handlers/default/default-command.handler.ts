import { Provides } from 'typescript-ioc';

import { CommandHandler } from '../comand.handler';

@Provides (CommandHandler)
export class DefaultCommandHandler extends CommandHandler {
    public async handle(): Promise<void> {
        return Promise.resolve();
    }
}
