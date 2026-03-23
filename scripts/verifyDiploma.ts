import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x079c90cFE618BD058Bcd11F1dF19D9184cb6B7B1";

async function main() {
  const { ethers } = await network.connect("nexusTestnet");

  const contract = await ethers.getContractAt(
    "InvestionnaireDiploma",
    CONTRACT_ADDRESS
  );

  const tokenId = 1n;
  const result = await contract.verifyDiploma(tokenId);

  console.log("Verification result for token", tokenId.toString());
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
