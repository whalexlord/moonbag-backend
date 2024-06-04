const {
  getTokenList,
  getTokenPrice,
} = require('../controller/evmController');
const {
  getSplTokenList,
  getSplTokenPrice,
} = require('../controller/solController');
const { runServer } = require('../const.ts');

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
};
