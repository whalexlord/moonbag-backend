import { Express } from "express";
import { getTokenList, getTokenPrice } from "../controller/EVMController";
import {
  getSplTokenList,
  getTokenPrice as getSplTokenPrice,
} from "../controller/SOLController";
import { runServer } from "../const";

runServer();

module.exports = (app: Express) => {
  app.use("/start", (req, res) => {
    res.send("OK");
  });
  
  app.get("/tokenlist", async (req, res) => {
    try {
      console.log(req.query);
      const owner = req.query.owner;
      const chain = req.query.chain;

      switch (chain?.toString().toLowerCase()) {
        case "sol" || "solana":
          res.status(200).json(await getSplTokenList(owner as string));
          break;
        case "eth" || "ethereum":
          res.status(200).json(await getTokenList(owner as string));
          break;
        default:
          res.send("Invalid chain");
      }
    } catch (error) {
      res.send(error);
    }
  });

  app.get("/getTokenPrice", async (req, res) => {
    try {
      console.log(req.query);
      const tokenAddress = req.query.address;
      const chain = req.query.chain;

      switch (chain?.toString().toLowerCase()) {
        case "sol" || "solana":
          console.log("fetching spl token price");
          res.status(200).json(await getSplTokenPrice(tokenAddress as string));
          break;
        case "eth" || "ethereum":
          console.log("fetching token price on EVM");
          res.status(200).json(await getTokenPrice(tokenAddress as string));
          break;
        default:
          res.send("Invalid chain");
      }
    } catch (error) {
      res.send(error);
    }
  });
};
