import { Bot } from './bot';
import { Container } from 'typescript-ioc';

const bot: Bot = Container.get(Bot);
bot.start();
