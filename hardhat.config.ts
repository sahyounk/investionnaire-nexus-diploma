import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatIgnition from "@nomicfoundation/hardhat-ignition";
import dotenv from "dotenv";

dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const NEXUS_RPC_URL =
  process.env.NEXUS_RPC_URL || "https://rpc.nexus.testnet.apexfusion.org/";
const NEXUS_CHAIN_ID = Number(process.env.NEXUS_CHAIN_ID || "9070");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatIgnition],
  networks: {
    nexusTestnet: {
      type: "http",
      chainType: "l1",
      url: NEXUS_RPC_URL,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: NEXUS_CHAIN_ID,
    },
  },
};

export default config;
