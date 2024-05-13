import express, { Express } from "express";
import dotConfig from "dotenv";

dotConfig.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/start", (req, res) => {});

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
