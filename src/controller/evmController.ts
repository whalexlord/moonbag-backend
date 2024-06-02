import { Alchemy, Network, TokenBalance } from "alchemy-sdk";
import Moralis from "moralis";
import dotConfig from "dotenv";
const { EvmChain } = require("@moralisweb3/common-evm-utils");

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
export const getTokenList = async (owner: string) => {
  // Get token balances
  const balances = await alchemy.core.getTokenBalances(owner);
  console.log(balances);
  // Remove balances with zero balance
  const nonZeroBalances = balances.tokenBalances.filter(
    (item: TokenBalance) => item.tokenBalance !== "0"
  );

  // initalize list for tokens on owner address.
  const tokenList = [];
  let i = 0;

  // loop through all tokens in non-zero Tokens
  for (i = 0; i < nonZeroBalances.length; i++) {
    const token: TokenBalance = nonZeroBalances[i];
    // Get balance for current token in non-zero balance list.
    let balance = parseFloat(token.tokenBalance as string);

    // Get meta data for current token
    const metaData = await alchemy.core.getTokenMetadata(token.contractAddress);

    // Compute token balance in user friendly format
    // balance /= Math.pow(10, metaData.decimals as number);
    balance = parseFloat(balance.toFixed(3));

    tokenList.push({
      ...metaData,
      balance: token.tokenBalance,
      address: token.contractAddress,
    });
  }

  return tokenList;
};

export const getTokenPrice = async (address: string) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: EvmChain,
      address,
    });

    const price = response.raw;

    console.log(price);

    return price;
  } catch (error) {
    return {error: "Unregistered token address"};
  }
};
