require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx =>
  ctx.reply(`👋🏻 Welcome!\n
  Forward me a message and I will tell you when it was sent 👀`)
);

bot.on('message', ctx => {
  if (ctx.message.forward_date) {
    let date = new Date(ctx.message.forward_date * 1000);
    let day = date.getDate();
    let month = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    let minutes = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    let message_id = ctx.message.message_id;
    ctx.reply(`${day} ${month} ${year} ${hours}:${minutes}:${seconds}`, {
      reply_to_message_id: message_id,
    });
  } else {
    ctx.reply('Pleeeease forward not send ☺️');
  }
});

bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
