#!/usr/bin/env node
/**
 * Poly-Merger: Position Merging Utility for Polymarket (TypeScript)
 */
import { ethers, BigNumberish } from 'ethers';
import * as dotenv from 'dotenv';
import { signAndExecuteSafeTransaction } from './safe-helpers';
import { safeAbi } from './safeAbi';

dotenv.config();

// RPC provider (Polygon)
const provider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL || 'https://polygon.llamarpc.com'
);

const privateKey = process.env.PK;
if (!privateKey) {
  console.error('Error: Private key (PK) not set in environment variables.');
  process.exit(1);
}
const wallet = new ethers.Wallet(privateKey, provider);

// Polymarket contract addresses
const addresses = {
  neg_risk_adapter: '0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296',
  collateral: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  conditional_tokens: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045'
};

// Minimal ABIs
const negRiskAdapterAbi = [
  'function mergePositions(bytes32 conditionId, uint256 amount)'
];
const conditionalTokensAbi = [
  'function mergePositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint256[] partition, uint256 amount)'
];

/**
 * Merges YES/NO positions to recover USDC collateral.
 */
async function mergePositions(
  amountToMerge: BigNumberish,
  conditionId: string,
  isNegRiskMarket: boolean
): Promise<string> {
  console.log('Parameters:', { amountToMerge, conditionId, isNegRiskMarket });
  const nonce = await provider.getTransactionCount(wallet.address);
  const gasPrice = await provider.getGasPrice();
  const gasLimit = 10_000_000;

  let populated: ethers.PopulatedTransaction;
  if (isNegRiskMarket) {
    const negRiskAdapter = new ethers.Contract(
      addresses.neg_risk_adapter,
      negRiskAdapterAbi,
      wallet
    );
    populated = await negRiskAdapter.populateTransaction.mergePositions(
      conditionId,
      amountToMerge
    );
  } else {
    const conditionalTokens = new ethers.Contract(
      addresses.conditional_tokens,
      conditionalTokensAbi,
      wallet
    );
    populated = await conditionalTokens.populateTransaction.mergePositions(
      addresses.collateral,
      ethers.constants.HashZero,
      conditionId,
      [1, 2],
      amountToMerge
    );
  }

  const tx = {
    ...populated,
    chainId: 137,
    gasPrice,
    gasLimit,
    nonce
  };

  const safeAddress = process.env.BROWSER_ADDRESS;
  if (!safeAddress) {
    console.error('Error: Safe address (BROWSER_ADDRESS) not set in environment variables.');
    process.exit(1);
  }
  const safe = new ethers.Contract(safeAddress, safeAbi, wallet);

  console.log('Signing & sending transaction...');
  const txResponse = await signAndExecuteSafeTransaction(
    wallet,
    safe,
    tx.to as string,
    tx.data as string,
    { gasPrice: tx.gasPrice, gasLimit: tx.gasLimit }
  );

  console.log('Transaction sent, awaiting confirmation...');
  const receipt = await txResponse.wait();
  console.log('Merge complete. Transaction hash:', receipt.transactionHash);
  return receipt.transactionHash;
}

function printUsageAndExit(): void {
  console.error('Usage: merge <amountToMerge> <conditionId> <isNegRiskMarket>');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length !== 3) {
  printUsageAndExit();
}
const [amountArg, conditionArg, isNegArg] = args;
const isNeg = isNegArg.toLowerCase() === 'true';

mergePositions(amountArg, conditionArg, isNeg).catch(error => {
  console.error('Error merging positions:', error);
  process.exit(1);
});