import { config } from 'dotenv';
config();
import { hit as hitUseCounter, get as getCounter } from 'countapi-js';
import { Telegraf } from 'telegraf';

const port = process.env.PORT || 3000;
const adminUser = process.env.ADMIN_USER;
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx =>
  ctx.reply(`ππ» Welcome!\n
  Forward me a message and I will tell you when it was sent π`)
);

bot.command('used', async () => {
  const result = await getCounter(
    'bogdanbryzh.me',
    'forward_message_bot_sends'
  );
  if (result.status === 200) {
    return bot.telegram.sendMessage(adminUser, `${result.value}`);
  }
});

bot.on('message', async ctx => {
  await hitUseCounter('bogdanbryzh.me', 'forward_message_bot_sends');

  if (ctx.message.forward_date) {
    const date = new Date(ctx.message.forward_date * 1000);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const message_id = ctx.message.message_id;
    ctx.reply(`${hours}:${minutes}:${seconds} UTC ${day} ${month} ${year}`, {
      reply_to_message_id: message_id,
    });
  } else {
    ctx.reply('Pleeeease forward not send βΊοΈ');
  }
});

bot.launch({
  webhook: {
    domain: 'https://forward-date-bot.herokuapp.com/',
    port: port,
  },
});
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
