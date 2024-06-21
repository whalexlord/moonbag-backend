const {
  getTokenList,
  getTokenPrice,
  assembleTransaction,
  quoteTransaction,
  getNativePrice,
} = require('../controller/evmController.js');
const {
  getSplTokenList,
  getSplTokenPrice,
  createTradeInstruction,
  getSolPrice,
  addNewAction,
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
          const r = await getSplTokenPrice(tokenAddress);
          console.log(r.price);
          res.status(200).json(r);
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

  app.get('/getBalance', async (req, res) => {
    try {
      const chain = req.query.chain;
      switch (chain?.toString().toLowerCase()) {
        case 'sol' || 'solana':
          res.status(200).json(await getSolPrice());
          break;
        case 'eth' || 'ethereum':
          res.status(200).json(getNativePrice());
          break;
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

  app.get('/sellToken', async (req, res) => {
    try {
      const address = req.query.address;
      const tokens = req.query.tokens.split(',');
      const amounts = req.query.amounts.split(',');

      console.log(address, tokens, amounts);

      const tx = await assembleTransaction(address, tokens, amounts);
      console.log(tx);
      res.status(200).json(tx);
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  });

  app.get('/record', async (req, res) => {
    try {
      const address = req.query.address;
      const asset = req.query.asset;
      const amount = req.query.amount;
      const isBurn = req.query.burn;
      const chain = req.query.chain;

      console.log('Record : ', address, asset, amount, isBurn, chain);

      switch (chain.toLowerCase()) {
        case 'sol' || 'solana':
          const data = await addNewAction(address, asset, amount, isBurn);
          res.send({ success: 'success' });
          break;
      }
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  });
};
