import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import dotenv from "dotenv";

dotenv.config();

const admin = process.env.ADMIN_WALLET || "";
const treasury = process.env.ISSUER_TREASURY || "";
const fee = BigInt(process.env.NATIVE_FEE_WEI || "1000000000000000");

export default buildModule("InvestionnaireDiplomaModule", (m) => {
  const diploma = m.contract("InvestionnaireDiploma", [admin, treasury, fee]);

  return { diploma };
});
