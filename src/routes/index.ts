import { Express } from "express";
import { getTokenList, getTokenPrice } from "../controller/EVMController";
import {
  getSplTokenList,
  getTokenPrice as getSplTokenPrice,
} from "../controller/SOLController";

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
          res.send(await getSplTokenList(owner as string));
          break;
        case "eth" || "ethereum":
          res.send(await getTokenList(owner as string));
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
          res.send(await getSplTokenPrice(tokenAddress as string));
          break;
        case "eth" || "ethereum":
          console.log("fetching token price on EVM");
          res.send(await getTokenPrice(tokenAddress as string));
          break;
        default:
          res.send("Invalid chain");
      }
    } catch (error) {
      res.send(error);
    }
  });
};
