# Poly-Merger

A CLI tool to merge Polymarket YES/NO positions and reclaim USDC.

## Prerequisites

- Node.js >=14
- npm or yarn

Create `.env` in this directory with:
```
RPC_URL=<your_rpc_url> # optional; default https://polygon.llamarpc.com
PK=<your_private_key>
BROWSER_ADDRESS=<your_gnosis_safe_address>
```

## Setup

cd poly_merger
npm install

## Build

npm run build

## Run

- Compiled: npm start -- <amount> <conditionId> <isNegRisk>
- Direct TS: npx ts-node src/merge.ts <amount> <conditionId> <isNegRisk>

Args:
- <amount>: in raw units (e.g., 1000000 = 1 USDC)
- <conditionId>: bytes32 hex string
- <isNegRisk>: true or false
