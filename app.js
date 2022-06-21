import 'dotenv/config';
import fetch from 'node-fetch';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest
} from './utils.js';
import {
  PRICE_COMMAND,
  HasGuildCommands,
} from './commands.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({
  verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)
}));


/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const {
    type,
    id,
    data
  } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({
      type: InteractionResponseType.PONG
    });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const {
      name
    } = data;

    // "price" guild command
    if (name === 'price') {
      // Send a message into the channel where command was triggered from

      async function response() {
        //Cointstore
        let responseCoinstore, dataCoinstore, dataCoinstore1, coinstoreLast, coinstoreVolume, coinstoreChange, textCoinstore, lengthCoinstore;
        try {
          responseCoinstore = await fetch('https://api.coinstore.com/api/v1/market/tickers');
          dataCoinstore1 = await responseCoinstore.json();
          dataCoinstore = dataCoinstore1.data;
          lengthCoinstore = dataCoinstore.length;
          for (let i = 0; i < lengthCoinstore; i++) {
            if (dataCoinstore[i].symbol == "LEGOUSDT") {
              coinstoreLast = dataCoinstore[i].close;
              coinstoreVolume = parseFloat(dataCoinstore[i].volume);
              coinstoreChange = (parseFloat(dataCoinstore[i].close) - parseFloat(dataCoinstore[i].open)) / (parseFloat(dataCoinstore[i].open) + parseFloat(dataCoinstore[i].close)) * 100;
            }
          }
          textCoinstore = `
✅Coinstore(LEGO / USDT)
https://www.coinstore.com/#/spot/LEGOUSDT
Last Price: ` + coinstoreLast + ` USDT
Volume: ` + coinstoreVolume.toFixed(2) + ` USDT
24H Change: ` + coinstoreChange.toFixed(2) + ` %
`;
        } catch (error) {
          textBitrue = 'Server On Going To Namec Planet';
        }

        //Bitrue
        let responseBitrue, dataBitrue, bitrueLast, bitrueVolume, bitrueChange, textBitrue, lengthBitrue;
        try {
          responseBitrue = await fetch('https://openapi.bitrue.com/api/v1/ticker/24hr');
          dataBitrue = await responseBitrue.json();
          lengthBitrue = dataBitrue.length;
          for (let i = 0; i < lengthBitrue; i++) {
            if (dataBitrue[i].symbol == "LEGOUSDT") {
              bitrueLast = dataBitrue[i].lastPrice;
              bitrueVolume = parseFloat(dataBitrue[i].quoteVolume);
              bitrueChange = parseFloat(dataBitrue[i].priceChange / (dataBitrue[i].lastPrice - dataBitrue[i].priceChange) * 100);
            }
          }
          textBitrue = `
✅Bitrue(LEGO / USDT)
https://www.bitrue.com/trade/lego_usdt
Last Price: ` + bitrueLast + ` USDT
Volume: ` + bitrueVolume.toFixed(2) + ` USDT
24H Change: ` + bitrueChange.toFixed(2) + ` %
`;
        } catch (error) {
          textBitrue = 'Server On Going To Namec Planet';
        }

        //Hotbit
        let responseHotbit, dataHotbit, hotbitLast, hotbitVolume, hotbitChange, textHotbit;
        try {
          responseHotbit = await fetch('https://api.hotbit.io/api/v1/market.status24h');
          dataHotbit = await responseHotbit.json();
          hotbitLast = dataHotbit.result.LEGOUSDT.close;
          hotbitVolume = parseFloat(dataHotbit.result.LEGOUSDT.quote_volume);
          hotbitChange = '-';
          textHotbit = `
✅Hotbit(LEGO / USDT)
https://www.hotbit.io/exchange?symbol=LEGO_USDT
Last Price: ` + hotbitLast + ` USDT
Volume: ` + hotbitVolume.toFixed(2) + ` USDT
24H Change: ` + hotbitChange + ` %
`;
        } catch (error) {
          textHotbit = 'Server On Going To Namec Planet';
        }

        //Digifinex
        let responseDigifinex, dataDigifinex, digifinexLast, digifinexVolume, digifinexChange, textDigifinex, lengthDigifinex;
        try {
          responseDigifinex = await fetch('https://openapi.digifinex.com/v3/ticker');
          dataDigifinex = await responseDigifinex.json();
          lengthDigifinex = dataDigifinex.ticker.length;
          for (let i = 0; i < lengthDigifinex; i++) {
            if (dataDigifinex.ticker[i].symbol == "lego_usdt") {
              digifinexLast = dataDigifinex.ticker[i].last;
              digifinexVolume = parseFloat(dataDigifinex.ticker[i].base_vol);
              digifinexChange = parseFloat(dataDigifinex.ticker[i].change);
            }
          }
          textDigifinex = `
✅Digifinex(LEGO / USDT)
https://www.digifinex.com/en-ww/trade/USDT/LEGO
Last Price: ` + digifinexLast + ` USDT
Volume: ` + digifinexVolume.toFixed(2) + ` USDT
24H Change: ` + digifinexChange.toFixed(2) + ` %
`;
        } catch (error) {
          textDigifinex = 'Server On Going To Namec Planet';
        }

        //LBank
        let responseLbank, dataLbank, lbankLast, lbankVolume, lbankChange, textLbank;
        try {
          responseLbank = await fetch('https://api.lbkex.com/v2/ticker/24hr.do?symbol=lego_usdt');
          dataLbank = await responseLbank.json();
          lbankLast = dataLbank.data[0].ticker.latest;
          lbankVolume = parseFloat(dataLbank.data[0].ticker.vol);
          lbankChange = parseFloat(dataLbank.data[0].ticker.change);

          textLbank = `
✅LBank(LEGO / USDT)
https://www.lbank.info/exchange/lego/usdt/#usd
Last Price: ` + lbankLast + ` USDT
Volume: ` + lbankVolume.toFixed(2) + ` USDT
24H Change: ` + lbankChange.toFixed(2) + ` %
`;
        } catch (error) {
          textLbank = 'Server On Going To Namec Planet';
        }

        // console.log(textCoinstore);
        // console.log(textBitrue);
        // console.log(textHotbit);
        // console.log(textDigifinex);
        // console.log(textLbank);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: textCoinstore + textBitrue + textHotbit + textDigifinex + textLbank,
          },
        });
      }
      response();
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    PRICE_COMMAND,
    // CHALLENGE_COMMAND,
  ]);
});