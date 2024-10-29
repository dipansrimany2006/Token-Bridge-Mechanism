require('dotenv').config();
const { Connection, Keypair } = require('@solana/web3.js');
const { SolBridge } = require('../src/bridges/SolBridge');

async function main() {
  const solanaConnection = new Connection(process.env.SOLANA_RPC_URL);
  const solanaWallet = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY))
  );

  const bridge = new SolBridge(solanaConnection, solanaWallet);
  const result = await bridge.bridgeSolToUsdt(process.env.AMOUNT_TO_BRIDGE);
  console.log('Bridge result:', result);
}

main().catch(console.error);