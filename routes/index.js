const {
  getTokenList,
  getTokenPrice,
} = require('../controller/evmController.js');
const {
  getSplTokenList,
  getSplTokenPrice,
  createTradeInstruction,
} = require('../controller/solController.js');
const { runServer } = require('../const.js');

runServer();

module.exports = (app) => {
  app.use('/start', (req, res) => {
    res.send('OK');
  });

  app.get('/tokenlist', async (req, res) => {
    try {
      console.log(req.query);
      const { owner } = req.query;
      const { chain } = req.query;

      switch (chain?.toString().toLowerCase()) {
        case 'sol' || 'solana':
          res.status(200).json(await getSplTokenList(owner));
          break;
        case 'eth' || 'ethereum':
          res.status(200).json(await getTokenList(owner));
          break;
        default:
          res.send('Invalid chain');
      }
    } catch (error) {
      res.send(error);
    }
  });

  app.get('/getTokenPrice', async (req, res) => {
    try {
      console.log(req.query);
      const tokenAddress = req.query.address;
      const { chain } = req.query;

      switch (chain?.toString().toLowerCase()) {
        case 'sol' || 'solana':
          console.log('fetching spl token price');
          res.status(200).json(await getSplTokenPrice(tokenAddress));
          break;
        case 'eth' || 'ethereum':
          console.log('fetching token price on EVM');
          res.status(200).json(await getTokenPrice(tokenAddress));
          break;
        default:
          res.send('Invalid chain');
      }
    } catch (error) {
      res.send(error);
    }
  });

  app.get('/createTradeSPL', async (req, res) => {
    try {
      const mint = req.query.mint;
      const amount = req.query.amount || 1000;
      const slippage = req.query.slippage || 2;
      const priorityFee = req.query.priorityFee || 0.002;
      const userPublicKey = req.query.userPublicKey;
      const pf = req.query.pf;
      console.log(mint, amount, slippage, priorityFee, userPublicKey, pf);
      const tx = await createTradeInstruction(
        mint,
        amount,
        userPublicKey,
        slippage,
        priorityFee,
        pf
      );
      res.send(tx);
    } catch (err) {
      console.error(error);
      res.send(error);
    }
  });
};
