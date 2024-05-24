import Moralis from "moralis";
import dotConfig from "dotenv";

dotConfig.config();
const apiKey = process.env.MORALIS_API_KEY;

const config = {
  apiKey,
};

// clone instance for moralis solana and start solana server.
Moralis.start(config);

export const getSplTokenList = async (address: string) => {
  const response = await Moralis.SolApi.account.getBalance({
    network: "mainnet",
    address,
  });

  const sol_data = response.raw;

  const response_spl = await Moralis.SolApi.account.getSPL({
    network: "mainnet",
    address,
  });

  const spl_data = response_spl.raw;

  const tokenList = [sol_data, spl_data];

  return tokenList;
};
