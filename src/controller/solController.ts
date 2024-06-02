import Moralis from "moralis";
import dotConfig from "dotenv";

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

export const getTokenPrice = async (address: string) => {
  console.log("fetching spl token price");
  try {
    const response = await Moralis.SolApi.token.getTokenPrice({
      network: "mainnet",
      address,
    });
  
    const price = response.raw;
  
    console.log(price);
  
    return price;
  } catch (error) {
    return {error: "Unregistered spl token address"}
  }
};
