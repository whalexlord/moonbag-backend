import { Express } from "express";
import { getTokenList } from "../controller/evm_controller";

module.exports = (app: Express) => {
  app.use("/start", (req, res) => {
    res.send("OK");
  });
  app.get("/tokenlist", async (req, res) => {
    try {
      console.log(req.query);
      const owner = req.query.owner;
      console.log(owner);
      const data = await getTokenList(owner as string);
      console.log(data);
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  });
};
