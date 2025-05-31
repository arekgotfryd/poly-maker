# Poly-Merger

A utility for merging Polymarket positions efficiently. This tool helps in consolidating opposite positions in the same market, allowing you to:

1. Reduce gas costs
2. Free up capital
3. Simplify position management

## How It Works

The merger tool interacts with Polymarket's smart contracts to combine opposite positions in binary markets. When you hold both YES and NO shares in the same market, this tool will merge them to recover your USDC.

## Usage

The merger is invoked through the main Poly-Maker bot when position merging conditions are met, but you can also use it independently:

```
node merge.js [amount_to_merge] [condition_id] [is_neg_risk_market]
```

Example:
```
node merge.js 1000000 1234567 true
```

This would merge 1 USDC worth of opposing positions in market 1234567, which is a negative risk market.

## Prerequisites

- Node.js v14 or later
- npm (or yarn)
- TypeScript (devDependency)
- ts-node (devDependency, for running scripts without build)
- ethers.js v5.x
- A `.env` file with your Polygon network private key and safe address variables

## TypeScript Usage

1. Install dependencies:
   ```
   cd poly_merger
   npm install
   ```

2. Build TypeScript:
   ```
   npm run build
   ```

3. Run compiled script:
   ```
   npm start -- <amount_to_merge> <condition_id> <is_neg_risk_market>
   ```

4. Or directly with ts-node (no build step):
   ```
   npx ts-node src/merge.ts <amount_to_merge> <condition_id> <is_neg_risk_market>
   ```

## Notes

This implementation is based on open-source Polymarket code but has been optimized for automated market making operations.