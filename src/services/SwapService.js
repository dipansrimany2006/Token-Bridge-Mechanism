class SwapService {
    constructor(connection, wallet) {
      this.connection = connection;
      this.wallet = wallet;
    }
  
    async swapToUsdt(fromTokenAddress, amount) {
      const jupiter = await Jupiter.load({
        connection: this.connection,
        cluster: 'mainnet-beta',
        user: this.wallet.publicKey
      });
  
      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(fromTokenAddress),
        outputMint: new PublicKey(config.USDT_SOLANA_ADDRESS),
        amount: amount * 1e9, // Adjust decimals as needed
        slippageBps: 50, // 0.5% slippage
      });
  
      const bestRoute = routes.routesInfos[0];
      const { execute } = await jupiter.exchange({
        routeInfo: bestRoute,
      });
  
      return await execute();
    }
  
    async waitForTokens(tokenAddress, maxAttempts = 30) {
      const tokenAccount = await this.findAssociatedTokenAccount(tokenAddress);
      
      for (let i = 0; i < maxAttempts; i++) {
        const balance = await this.getTokenBalance(tokenAccount);
        if (balance > 0) return balance;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      throw new Error('Timeout waiting for tokens');
    }
  
    async findAssociatedTokenAccount(tokenMint) {
      return (await PublicKey.findProgramAddress(
        [
          this.wallet.publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          new PublicKey(tokenMint).toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      ))[0];
    }
  
    async getTokenBalance(tokenAccount) {
      try {
        const accountInfo = await this.connection.getTokenAccountBalance(tokenAccount);
        return accountInfo.value.uiAmount;
      } catch (error) {
        return 0;
      }
    }
  }