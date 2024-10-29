const { 
    Token,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID 
  } = require('@solana/spl-token');
  const {
    transferFromSolana,
    postVaaWithRetry,
    getEmitterAddressSolana,
    parseSequenceFromLogSolana,
  } = require('@certusone/wormhole-sdk');
  
  class SolBridge {
    constructor(solanaConnection, solanaWallet) {
      this.connection = solanaConnection;
      this.wallet = solanaWallet;
      this.swapService = new SwapService(solanaConnection, solanaWallet);
    }
  
    async bridgeSolToUsdt(solAmount) {
      try {
        console.log(`Starting bridge of ${solAmount} SOL to USDT...`);
  
        // 1. Wrap SOL to wSOL
        const wsolAccount = await this.wrapSol(solAmount);
        
        // 2. Swap wSOL to USDT
        const swapResult = await this.swapService.swapToUsdt(
          config.WSOL_MINT_ADDRESS,
          solAmount
        );
  
        return {
          wsolAccount,
          swapResult
        };
      } catch (error) {
        console.error('Error in SOL to USDT bridge:', error);
        throw error;
      }
    }
  
    async wrapSol(amount) {
      const wsolMint = new PublicKey(config.WSOL_MINT_ADDRESS);
      const wsolToken = new Token(
        this.connection,
        wsolMint,
        TOKEN_PROGRAM_ID,
        this.wallet
      );
  
      const account = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        wsolMint,
        this.wallet.publicKey
      );
  
      const transaction = new Transaction().add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          wsolMint,
          account,
          this.wallet.publicKey,
          this.wallet.publicKey
        ),
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: account,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
        Token.createSyncNativeInstruction(account)
      );
  
      const signature = await this.connection.sendTransaction(
        transaction,
        [this.wallet]
      );
      await this.connection.confirmTransaction(signature);
  
      return account;
    }
  }
  