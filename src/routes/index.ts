import { Express } from "express";
import { getTokenList } from "../controller/evm_controller";
import { getSplTokenList } from "../controller/sol_controller";

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
};
