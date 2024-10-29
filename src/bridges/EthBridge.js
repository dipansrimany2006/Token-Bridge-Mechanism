const { ethers } = require('ethers');
const { Connection, PublicKey } = require('@solana/web3.js');
const {
  transferFromEth,
  getEmitterAddressEth,
  parseSequenceFromLogEth,
  getSignedVAA,
} = require('@certusone/wormhole-sdk');
const { Jupiter } = require('@jup-ag/core');
const config = require('../config');
const { SwapService } = require('../services/SwapService');

class EthBridge {
  constructor(ethereumProvider, solanaConnection, ethereumWallet, solanaWallet) {
    this.ethereumProvider = ethereumProvider;
    this.solanaConnection = solanaConnection;
    this.ethereumWallet = ethereumWallet;
    this.solanaWallet = solanaWallet;
    this.signer = new ethers.Wallet(ethereumWallet, ethereumProvider);
    this.swapService = new SwapService(solanaConnection, solanaWallet);
  }

  async bridgeEthToUsdt(ethAmount) {
    try {
      console.log(`Starting bridge of ${ethAmount} ETH to USDT on Solana...`);
      
      // 1. Bridge ETH to Solana
      const transferAmount = ethers.utils.parseEther(ethAmount.toString());
      const bridgeResult = await this.bridgeEthToSolana(transferAmount);
      
      // 2. Wait for wrapped ETH to arrive
      await this.swapService.waitForTokens(config.WETH_SOLANA_ADDRESS);
      
      // 3. Swap to USDT
      const swapResult = await this.swapService.swapToUsdt(
        config.WETH_SOLANA_ADDRESS,
        ethAmount
      );

      return {
        bridgeResult,
        swapResult
      };
    } catch (error) {
      console.error('Error in ETH to USDT bridge:', error);
      throw error;
    }
  }

  async bridgeEthToSolana(amount) {
    const transferTx = await transferFromEth(
      config.ETH_BRIDGE_ADDRESS,
      this.signer,
      null, // null for native ETH
      amount,
      config.CHAIN_ID_SOLANA,
      this.solanaWallet.publicKey.toBuffer(),
      undefined,
      { value: amount }
    );

    const receipt = await transferTx.wait();
    const sequence = parseSequenceFromLogEth(receipt, config.ETH_BRIDGE_ADDRESS);
    const emitterAddress = getEmitterAddressEth(config.ETH_BRIDGE_ADDRESS);

    const { signedVAA } = await getSignedVAA(
      config.WORMHOLE_RPC_HOST,
      config.CHAIN_ID_ETH,
      emitterAddress,
      sequence
    );

    return {
      txHash: transferTx.hash,
      signedVAA
    };
  }
}