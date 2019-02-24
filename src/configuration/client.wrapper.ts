import { Client } from 'discord.js';
import { Singleton } from 'typescript-ioc';

@Singleton
export class ClientWrapper {
    private readonly client: Client;

    public get Client() {
        return this.client;
    }

    constructor() {
        this.client = new Client();
    }
}
