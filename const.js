const Moralis = require("moralis").default;
require("dotenv").config();

const apiKey = process.env.MORALIS_API_KEY;

const config = {
  apiKey,
};

const runServer = async () => {
    console.log("Running moralis server");
    Moralis.start(config);
}

module.exports = {
  runServer
}