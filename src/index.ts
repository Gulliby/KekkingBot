import { KekkingBot } from './kekking-bot';
import { Container } from 'typescript-ioc';

const bot: KekkingBot = Container.get(KekkingBot);
bot.start();
