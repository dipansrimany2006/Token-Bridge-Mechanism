require('dotenv').config();
const { ethers } = require('ethers');
const { Connection, Keypair } = require('@solana/web3.js');
const { EthBridge } = require('../src/bridges/EthBridge');

async function main() {
  const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
  const solanaConnection = new Connection(process.env.SOLANA_RPC_URL);
  
  const ethereumWallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY);
  const solanaWallet = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY))
  );

  const bridge = new EthBridge(
    ethereumProvider,
    solanaConnection,
    ethereumWallet,
    solanaWallet
  );

  const result = await bridge.bridgeEthToUsdt(process.env.AMOUNT_TO_BRIDGE);
  console.log('Bridge result:', result);
}

main().catch(console.error);