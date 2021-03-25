require('dotenv').config();

const countapi = require('countapi-js');

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx =>
  ctx.reply(`👋🏻 Welcome!\n
  Forward me a message and I will tell you when it was sent 👀`)
);

bot.on('message', ctx => {
  countapi.hit('bogdanbryzh.me', 'forward_message_bot_sends').then(result => {
    bot.telegram.sendMessage(
      835930952,
      `One more used it ;)\n ${result.value} times already used`
    );
  });

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
    ctx.reply('Pleeeease forward not send ☺️');
  }
});

bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
