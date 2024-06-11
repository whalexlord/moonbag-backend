const Alchemy = require('alchemy-sdk').Alchemy;
const Network = require('alchemy-sdk').Network;

const Moralis = require('moralis').default;
const dotConfig = require('dotenv');

const { EvmChain } = require('@moralisweb3/common-evm-utils');

dotConfig.config();
const apiKey = process.env.ALCHEMY_API_KEY;

const config = {
  apiKey,
  network: Network.ETH_MAINNET,
};

// initalize alchemy instance for alchemy eth
const alchemy = new Alchemy(config);

// parameter
// @owner address to fetch tokens lists on-hand
const getTokenList = async (owner) => {
  // Get token balances
  const balances = await alchemy.core.getTokenBalances(owner);
  // Remove balances with zero balance
  const nonZeroBalances = balances.tokenBalances.filter(
    (item) => item.tokenBalance !== '0'
  );

  // initalize list for tokens on owner address.
  const tokenList = [];
  let i = 0;

  // loop through all tokens in non-zero Tokens
  for (i = 0; i < nonZeroBalances.length; i++) {
    const token = nonZeroBalances[i];
    // Get balance for current token in non-zero balance list.
    let balance = parseFloat(token.tokenBalance);

    // Get meta data for current token
    const metaData = await alchemy.core.getTokenMetadata(token.contractAddress);

    // Compute token balance in user friendly format
    // balance /= Math.pow(10, metaData.decimals as number);
    balance = parseFloat(balance.toFixed(3));

    tokenList.push({
      ...metaData,
      amount: parseInt(token.tokenBalance, 16) / 10 ** metaData.decimals,
      mint: token.contractAddress,
    });
  }

  return tokenList;
};

const getTokenPrice = async (address) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: '0x1',
      address,
    });
    console.log(response.raw);
    const price = response.raw;

    console.log(price);

    return price;
  } catch (error) {
    // console.error(error);
    return { price: 0.001, pf: '' };
  }
};

const quoteUrl = 'https://api.odos.xyz/sor';

const quoteTransaction = async (wallet, tokens, amounts) => {
  const inputTokens = tokens.map((token, i) => {
    return { tokenAddress: token, amount: amounts[i] };
  });

  const quoteRequestBody = {
    chainId: 1, // Replace with desired chainId
    inputTokens: inputTokens,
    outputTokens: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000', // checksummed output token address
        proportion: 1,
      },
    ],
    gasPrice: 20,
    userAddr: wallet, // checksummed user address
    slippageLimitPercent: 0.3, // set your slippage limit percentage (1 = 1%),
    referralCode: 0, // referral code (recommended)
    compact: true,
  };
  console.log(quoteRequestBody);
  const response = await fetch(quoteUrl + '/quote/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteRequestBody),
  });

  if (response.status === 200) {
    const quote = await response.json();
    console.log(quote);
    return quote;
  } else {
    console.error('Error in Quote:', response);
    // handle quote failure cases
    return false;
  }
};

const assembleTransaction = async (wallet, tokens, amounts) => {
  const quote = await quoteTransaction(wallet, tokens, amounts);
  // handle quote response data
  console.log(quote.pathId);
  const assembleRequestBody = {
    pathId: quote.pathId,
    simulate: false,
    userAddr: wallet,
  };

  const assembledTransaction = await (
    await fetch(quoteUrl + '/assemble', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assembleRequestBody),
    })
  ).json();

  console.log(assembledTransaction.transaction);
  return assembledTransaction.transaction;
};

module.exports = {
  getTokenList,
  getTokenPrice,
  quoteTransaction,
  assembleTransaction,
};
