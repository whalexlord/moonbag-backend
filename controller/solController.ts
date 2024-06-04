import Moralis from "moralis";
import dotConfig from "dotenv";
import axios from "axios";
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

  const tokenList = [sol_data, ...spl_data];
  console.log(tokenList);

  return tokenList;
};

//@address spl token address
//get spl token price

export const getSplTokenPrice = async (address: string) => {
  console.log("fetching spl token price");

  try {
    const response = await axios.get(`https://price.jup.ag/v6/price?ids=${address}`);
    console.log(response.data.data);
    if (!response.data.data[address]) {
      try {
        const response = await Moralis.SolApi.token.getTokenPrice({
          network: "mainnet",
          address,
        });

        const price = response.raw;

        console.log(price);

        return { price : price.usdPrice};
      } catch (error) {
        return { error: "Unregistered spl token address" }
      }
    } else {
      const price = response.data.data[address].price;
      console.log(`${address} price in usdc: ${price}`);
      return { price };
    }
  } catch (error: any) {
    console.error('Error fetching token price:', error.message);
  }
};
