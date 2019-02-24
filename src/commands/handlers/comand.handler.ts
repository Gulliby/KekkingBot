// TODO: commandLine should be int parameters of handle method.
export abstract class CommandHandler {
    public abstract handle(): Promise<void>;
}
