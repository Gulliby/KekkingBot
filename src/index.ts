import { Bot } from './bot';
import { Container } from 'typescript-ioc';
import { Client } from 'discord.js';

Container.bind(Client).to(Client);

const bot: Bot = Container.get(Bot);
bot.start();
