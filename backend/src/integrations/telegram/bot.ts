import { config } from '../../config';
import { Bot } from 'grammy';
import { handleStart, handleBind, handleStatus, handleTest, handleHelp } from './handlers';

const bot = new Bot(config.telegramBotToken!);

bot.command('start', handleStart);
bot.command('bind', handleBind);
bot.command('status', handleStatus);
bot.command('test', handleTest);
bot.command('help', handleHelp);

export { bot };
