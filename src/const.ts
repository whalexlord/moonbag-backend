import Moralis from "moralis";
import dotConfig from "dotenv";

dotConfig.config();

const apiKey = process.env.MORALIS_API_KEY;

const config = {
  apiKey,
};

export const runServer = async () => {
    console.log("Running moralis server");
    Moralis.start(config);
}
