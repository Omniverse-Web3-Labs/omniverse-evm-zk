require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');

const privateKey = fs.readFileSync('./.env').toString();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    live: {
      url: `http://127.0.0.1:8545`,
      accounts: [privateKey]
    }
  }
};
