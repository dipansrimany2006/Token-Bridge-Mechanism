const { EthBridge } = require('../src/bridges/EthBridge');
const { SolBridge } = require('../src/bridges/SolBridge');

describe('Bridge Tests', () => {
  let ethBridge;
  let solBridge;

  beforeAll(async () => {
    // Initialize test connections and wallets
  });

  test('ETH to USDT bridge', async () => {
    const result = await ethBridge.bridgeEthToUsdt('0.1');
    expect(result).toBeDefined();
    expect(result.bridgeResult).toBeDefined();
    expect(result.swapResult).toBeDefined();
  });

  test('SOL to USDT bridge', async () => {
    const result = await solBridge.bridgeSolToUsdt(1);
    expect(result).toBeDefined();
    expect(result.wsolAccount).toBeDefined();
    expect(result.swapResult).toBeDefined();
  });
});