import { CommandLine } from '../models/command-line';

export interface ICommandHandler {
    handle(commandLine: CommandLine): void;
}
