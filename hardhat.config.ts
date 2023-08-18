import dotenv from "dotenv";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter"
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

dotenv.config();

const chainIds = {
  hardhat: 31337,
  ganache: 1337,
  mainnet: 1,
  rinkeby: 4,
  goerli: 5,
  arbGoerli: 421613,
};

// Ensure that we have all the environment variables we need.
const privateKey: string = process.env.PRIVATE_KEY || "";
const infuraKey: string = process.env.INFURA_KEY || "";

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  if (!infuraKey) {
    throw new Error("Missing INFURA_KEY");
  }

  let nodeUrl;
  switch (network) {
    case "mainnet":
      nodeUrl = `https://mainnet.infura.io/v3/${infuraKey}`;
      break;
    case "rinkeby":
      nodeUrl = `https://rinkeby.infura.io/v3/${infuraKey}`;
      break;
    case "goerli":
      nodeUrl = `https://goerli.infura.io/v3/${infuraKey}`;
      break;
    case "arbGoerli":
      nodeUrl = `https://arb-goerli.g.alchemy.com/v2/${infuraKey}`;
      break;
  }

  return {
    chainId: chainIds[network],
    url: nodeUrl,
    accounts: [`${privateKey}`],
  };
}

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.12",
    settings: {
      metadata: {
        bytecodeHash: "ipfs",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 590,
      },
    },
  },
  abiExporter: {
    flat: true,
  },
  mocha: {
    parallel: false
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_KEY || '',
      rinkeby: process.env.ETHERSCAN_KEY || '',
      goerli: process.env.ETHERSCAN_KEY || '',
      arbGoerli: process.env.ETHERSCAN_KEY || '',
    },
    customChains: [
      {
        network: "arbGoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://goerli.arbiscan.io/"
        }
      }
    ]
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
  },
};

if (privateKey) {
  config.networks = {
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
    rinkeby: createTestnetConfig("rinkeby"),
    arbGoerli: createTestnetConfig("arbGoerli"),
  };
}

config.networks = {
  ...config.networks,
  hardhat: {
    chainId: 1337,
  },
};

export default config;