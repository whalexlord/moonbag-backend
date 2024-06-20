const Moralis = require('moralis').default;
const axios = require('axios');
const { VersionedTransaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('cross-fetch');

const url = 'https://pumpportal.fun/api/trade-local';
const pfEndpoint = 'https://frontend-api.pump.fun/coins';

require('dotenv').config();

const getSplTokenList = async (address) => {
  try {
    const response_spl = await Moralis.SolApi.account.getSPL({
      network: 'mainnet',
      address,
    });

    const spl_data = response_spl.raw;

    const tokenList = [...spl_data];

    return { tokens: tokenList };
  } catch (error) {
    console.log(error);
    const data = await getSplTokenList(address);
    return data;
  }
};

//@address spl token address
//get spl token price

const getSolPrice = async () => {
  const response = await Moralis.SolApi.token.getTokenPrice({
    network: 'mainnet',
    address: 'So11111111111111111111111111111111111111112',
  });

  return { inUsd: response.raw.usdPrice };
};

const getSplTokenPrice = async (address) => {
  // console.log('fetching spl token price ',address);
  try {
    const response = await axios.get(
      `https://price.jup.ag/v6/price?ids=${address}`
    );
    // console.log(response.data.data);
    if (!response.data.data[address]) {
      try {
        const response1 = await Moralis.SolApi.token.getTokenPrice({
          network: 'mainnet',
          address,
        });

        const price = response1.raw;

        return { price: price.usdPrice, pf: 'rs' };
      } catch (error) {
        try {
          const response_pf = await axios.get(`${pfEndpoint}/${address}`);
          const solPriceinusd = await getSolPrice();

          const pf_splData = response_pf.data;
          console.log(solPriceinusd, pf_splData);

          return {
            price:
              (solPriceinusd.inUsd /
                parseFloat(pf_splData.virtual_token_reserves)) *
              parseFloat(pf_splData.virtual_sol_reserves),
            pf: 'pf',
          };
        } catch (error) {
          console.error(error);
          return { price: 0, pf: 'js' };
        }
      }
    } else {
      const price = response.data.data[address].price;
      return { price, pf: 'js' };
    }
  } catch (error) {
    return { price: 0, pf: 'js' };
  }
};

const createTradeInstruction = async (
  mint,
  amount,
  userPublicKey,
  slippage = 2,
  priorityFee = 0.005,
  pf = 'js'
) => {
  const data = {
    action: 'sell',
    mint,
    amount,
    slippage,
    priorityFee,
    denominatedInSol: 'false',
    publicKey: userPublicKey,
  };

  try {
    // pumpfun spl tokens
    if (pf == 'pf') {
      const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        // successfully generated transaction
        const data = await response.arrayBuffer();
        const buff = bs58.encode(new Uint8Array(data));
        return buff;
      } else {
        console.log(response.statusText); // log error
      }
      return bs58.encode(swapTransactionBuf);
    }
    // Jupiter spl tokens
    else if (pf == 'js' || pf == 'rs') {
      const quoteResponse = await (
        await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${mint}&outputMint=So11111111111111111111111111111111111111112&amount=${parseInt(
            amount
          )}&slippageBps=${50}`
        )
      ).json();

      console.log(quoteResponse);
      const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey,
            wrapAndUnwrapSol: true,
          }),
        })
      ).json();

      // console.log(swapTransaction);
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      return bs58.encode(swapTransactionBuf);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getSplTokenList,
  getSplTokenPrice,
  createTradeInstruction,
  getSolPrice,
};
