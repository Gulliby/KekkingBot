import { CommandLine } from '../models/command-line';

export abstract class CommandHandler {
    protected abstract handle(commandLine: CommandLine): Promise<void>;
}
