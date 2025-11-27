// config/tokens.ts

/**
 * 代币配置接口
 */
interface TokenConfig {
  address: string // 原始合约地址
  caipAddress: string // CAIP-10 格式地址 (eip155:chainId:address)
  chainId: number // 数字链 ID
  caipChainId: string // CAIP-2 格式链 ID (eip155:chainId)
  symbol: string // 代币名称
  decimals: number // 精度
}

/**
 * 各链稳定币配置（仅 USDT/USDC）
 * 数据来源: 各链官方文档和区块浏览器
 */
export const STABLE_TOKENS = {
	// Ethereum Mainnet
	1: {
		USDT: {
			address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			caipAddress: 'eip155:1:0xdAC17F958D2ee523a2206206994597C13D831ec7',
			chainId: 1,
			caipChainId: 'eip155:1',
			symbol: 'USDT',
			decimals: 6
		},
		USDC: {
			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			caipAddress: 'eip155:1:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			chainId: 1,
			caipChainId: 'eip155:1',
			symbol: 'USDC',
			decimals: 6
		}
	},

	// Sepolia Testnet
	11155111: {
		// USDT: {
		// 	address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8Da470',
		// 	caipAddress: 'eip155:11155111:0xaA8E23Fb1079EA71e0a56F48a2aA51851D8Da470',
		// 	chainId: 11155111,
		// 	caipChainId: 'eip155:11155111',
		// 	symbol: 'USDT',
		// 	decimals: 6
		// },
		USDC: {
			address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
			caipAddress: 'eip155:11155111:0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
			chainId: 11155111,
			caipChainId: 'eip155:11155111',
			symbol: 'USDC',
			decimals: 6
		}
	},

	// BSC (BNB Chain)
	56: {
		USDT: {
			// address: 'eip155:56:0x55d398326f99059ff775485246999027b3197955',
			// chainId: 'eip155:56',
			// iconUrl: 'https://api.sim.dune.com/beta/token/logo/56/0x55d398326f99059ff775485246999027b3197955',
			// name: 'USDT',
			// price: 0.3286782539757925,
			// quantity: { decimals: '18', numeric: '8.650000000000000000' },
			// symbol: 'USDT',
			// value: 2.843066896890605,
			address: '0x55d398326f99059fF775485246999027B3197955',
			caipAddress: 'eip155:56:0x55d398326f99059fF775485246999027B3197955',
			chainId: 56,
			caipChainId: 'eip155:56',
			symbol: 'USDT',
			decimals: 18 // ⚠️ BSC 的 USDT 是 18 位！
		},
		USDC: {
			address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
			caipAddress: 'eip155:56:0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
			chainId: 56,
			caipChainId: 'eip155:56',
			symbol: 'USDC',
			decimals: 18 // ⚠️ BSC 的 USDC 也是 18 位！
		}
	},

	// Polygon
	137: {
		USDT: {
			address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
			caipAddress: 'eip155:137:0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
			chainId: 137,
			caipChainId: 'eip155:137',
			symbol: 'USDT',
			decimals: 6
		},
		USDC: {
			address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
			caipAddress: 'eip155:137:0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
			chainId: 137,
			caipChainId: 'eip155:137',
			symbol: 'USDC',
			decimals: 6
		}
	},

	// Optimism
	10: {
		USDT: {
			address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
			caipAddress: 'eip155:10:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
			chainId: 10,
			caipChainId: 'eip155:10',
			symbol: 'USDT',
			decimals: 6
		},
		USDC: {
			address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
			caipAddress: 'eip155:10:0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
			chainId: 10,
			caipChainId: 'eip155:10',
			symbol: 'USDC',
			decimals: 6
		},
	},

	// Arbitrum One
	42161: {
		USDT: {
			address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
			caipAddress: 'eip155:42161:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
			chainId: 42161,
			caipChainId: 'eip155:42161',
			symbol: 'USDT',
			decimals: 6
		},
		USDC: {
			address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
			caipAddress: 'eip155:42161:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
			chainId: 42161,
			caipChainId: 'eip155:42161',
			symbol: 'USDC',
			decimals: 6
		}
	},

	// Avalanche C-Chain
	43114: {
		USDT: {
			address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
			caipAddress: 'eip155:43114:0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
			chainId: 43114,
			caipChainId: 'eip155:43114',
			symbol: 'USDT',
			decimals: 6
		},
		USDC: {
			address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
			caipAddress: 'eip155:43114:0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
			chainId: 43114,
			caipChainId: 'eip155:43114',
			symbol: 'USDC',
			decimals: 6
		}
	},

	// zkSync Era
	324: {
		USDT: {
			address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
			caipAddress: 'eip155:324:0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
			chainId: 324,
			caipChainId: 'eip155:324',
			symbol: 'USDT',
			decimals: 6
		},
		USDC: {
			address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
			caipAddress: 'eip155:324:0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
			chainId: 324,
			caipChainId: 'eip155:324',
			symbol: 'USDC',
			decimals: 6
		}
	},

	// Base
	8453: {
		USDC: {
			address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
			caipAddress: 'eip155:8453:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
			chainId: 8453,
			caipChainId: 'eip155:8453',
			symbol: 'USDC',
			decimals: 6
		}
	}
} as const;

/**
 * 链 ID 到链名称的映射
 */
export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  56: 'BSC',
  137: 'Polygon',
  10: 'Optimism',
  42161: 'Arbitrum',
  43114: 'Avalanche',
  324: 'zkSync',
  8453: 'Base'
}

/**
 * 获取指定链的稳定币配置
 */
export function getStableTokens(chainId: number | string) {
  const tokens = STABLE_TOKENS[chainId as keyof typeof STABLE_TOKENS]
  if (!tokens) {
    console.warn(`⚠️ Chain ${chainId} (${CHAIN_NAMES[Number(chainId)] || 'Unknown'}) not configured for stable tokens`)
    return {}
  }
  return tokens
}

/**
 * 获取指定链的稳定币地址列表（原始地址）
 */
export function getStableTokenAddresses(chainId: number): string[] {
  const tokens = getStableTokens(chainId)
  return Object.values(tokens).map(token => token.address)
}

/**
 * 获取指定链的稳定币 CAIP 地址列表
 */
export function getStableTokenCaipAddresses(chainId: number): string[] {
  const tokens = getStableTokens(chainId)
  return Object.values(tokens).map(token => token.caipAddress)
}

/**
 * 获取指定链的稳定币名称列表
 */
export function getStableTokenNames(chainId: number): string[] {
  const tokens = getStableTokens(chainId)
  return Object.keys(tokens)
}

/**
 * 获取指定链的代币配置（含地址和精度）
 */
export function getTokenConfigs(chainId: number): Record<string, TokenConfig> {
  return getStableTokens(chainId) as Record<string, TokenConfig>
}

/**
 * 获取特定代币的精度
 */
export function getTokenDecimals(chainId: number, tokenSymbol: string): number {
  const tokens = getStableTokens(chainId) as Record<string, TokenConfig>
  return tokens[tokenSymbol]?.decimals || 6 // 默认 6（大多数稳定币）
}

/**
 * 获取特定代币的完整配置
 */
export function getTokenConfig(chainId: number, tokenSymbol: string): TokenConfig | null {
  const tokens = getStableTokens(chainId) as Record<string, TokenConfig>
  return tokens[tokenSymbol] || null
}

/**
 * 将原始地址转换为 CAIP-10 格式
 */
export function toCaipAddress(chainId: number, address: string): string {
  return `eip155:${chainId}:${address}`
}

/**
 * 从 CAIP-10 格式解析出链 ID 和地址
 */
export function parseCaipAddress(caipAddress: string): { chainId: number; address: string } | null {
  const match = caipAddress.match(/^eip155:(\d+):(0x[a-fA-F0-9]{40})$/)
  if (!match) return null
  
  return {
    chainId: parseInt(match[1]),
    address: match[2]
  }
}

/**
 * 检查链是否支持稳定币查询
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in STABLE_TOKENS
}

/**
 * 获取所有支持的链 ID
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(STABLE_TOKENS).map(Number)
}

/**
 * 获取 CAIP-2 格式的链 ID
 */
export function getCaipChainId(chainId: number): string {
  return `eip155:${chainId}`
}