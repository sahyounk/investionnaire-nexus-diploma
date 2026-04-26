# Investonaire Diploma — Frontend

Vite + React + TypeScript + Tailwind UI for the `InvestionnaireDiploma`
contract deployed on the Nexus testnet.

Branding mirrors investionnaire.com (Inter font, emerald→blue gradient,
amber accents, Investonaire wordmark logo).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## Pages

- `/` — landing
- `/verify` — public diploma lookup by token ID or wallet
- `/my-diploma` — connect wallet, view your diploma, pay-to-print
- `/issuer` — wallet must hold `ISSUER_ROLE`; mint or revoke diplomas
- `/admin` — wallet must hold `DEFAULT_ADMIN_ROLE`; update print fee or treasury

## Configuration

The contract address, chain ID, and RPC URL live in `src/config.ts`. If
you redeploy the contract, change `CONTRACT_ADDRESS` there.

The wallet auto-prompts MetaMask to add Nexus testnet (chain `9070`,
RPC `https://rpc.nexus.testnet.apexfusion.org/`).
