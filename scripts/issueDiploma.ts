import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x079c90cFE618BD058Bcd11F1dF19D9184cb6B7B1";

async function main() {
  const { ethers } = await network.connect("nexusTestnet");

  const [issuer] = await ethers.getSigners();
  console.log("Issuer wallet:", await issuer.getAddress());

  const contract = await ethers.getContractAt(
    "InvestionnaireDiploma",
    CONTRACT_ADDRESS
  );

  const graduate = "0x1256aa5C67ac89Cc1c0A5b6A5644a4a0a915791F";
  const studentName = "Test Graduate";
  const courseName = "Investionnaire Academy Real Estate Fundamentals";
  const diplomaURI = "ipfs://demo-diploma-metadata";

  const tx = await contract.issueDiploma(
    graduate,
    studentName,
    courseName,
    diplomaURI
  );

  console.log("Issuance tx sent:", tx.hash);
  await tx.wait();
  console.log("Diploma issued successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
