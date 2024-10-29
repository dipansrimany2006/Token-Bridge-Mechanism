require('dotenv').config();

module.exports = {
  // Network RPC endpoints
  ETH_RPC_URL: process.env.ETH_RPC_URL,
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,

  // Wormhole configuration
  WORMHOLE_RPC_HOST: 'https://wormhole-v2-mainnet-api.certus.one',
  
  // Bridge addresses
  ETH_BRIDGE_ADDRESS: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  ETH_TOKEN_BRIDGE_ADDRESS: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  SOL_BRIDGE_ADDRESS: 'worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth',
  SOL_TOKEN_BRIDGE_ADDRESS: 'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb',

  // Token addresses
  USDT_SOLANA_ADDRESS: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  WETH_SOLANA_ADDRESS: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
  WSOL_MINT_ADDRESS: 'So11111111111111111111111111111111111111112',

  // Chain IDs
  CHAIN_ID_ETH: 2,
  CHAIN_ID_SOLANA: 1,
};