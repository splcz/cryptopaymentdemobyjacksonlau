import { useBalance } from 'wagmi'
import { useChainId } from 'wagmi'

// 常见链的代币合约地址
const TOKEN_ADDRESSES: Record<number, { USDT?: `0x${string}`; USDC?: `0x${string}` }> = {
  // Ethereum Mainnet
  1: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  // Sepolia Testnet
  11155111: {
    USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  },
  // BSC Mainnet
  56: {
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  // Polygon Mainnet
  137: {
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  // Arbitrum One
  42161: {
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  // Optimism
  10: {
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  },
}

interface AssetBalanceProps {
  address: `0x${string}`
}

export function AssetBalance({ address }: AssetBalanceProps) {
  const chainId = useChainId()
  
  // 获取当前链的代币地址
  const tokenAddresses = TOKEN_ADDRESSES[chainId] || {}
  const usdtAddress = tokenAddresses.USDT
  const usdcAddress = tokenAddresses.USDC

  // 获取 USDT 余额（如果当前链支持）
  const { data: usdtBalance, isLoading: usdtLoading } = useBalance({
    address,
    token: usdtAddress,
    query: {
      enabled: !!usdtAddress && !!address,
    },
  })

  // 获取 USDC 余额（如果当前链支持）
  const { data: usdcBalance, isLoading: usdcLoading } = useBalance({
    address,
    token: usdcAddress,
    query: {
      enabled: !!usdcAddress && !!address,
    },
  })

  // 获取链名称
  const getChainName = (id: number) => {
    const chainNames: Record<number, string> = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      56: 'BSC',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
    }
    return chainNames[id] || `Chain ${id}`
  }

  const assets = [
    {
      symbol: 'USDT',
      balance: usdtBalance?.formatted || '0.00',
      loading: usdtLoading,
      decimals: usdtBalance?.decimals || 6,
      available: !!usdtAddress,
    },
    {
      symbol: 'USDC',
      balance: usdcBalance?.formatted || '0.00',
      loading: usdcLoading,
      decimals: usdcBalance?.decimals || 6,
      available: !!usdcAddress,
    },
  ]

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxSizing: 'border-box'
    }}>
      <div style={{
        fontSize: 'clamp(16px, 4.5vw, 18px)',
        fontWeight: 'bold',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        资产余额
      </div>
      <div style={{
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        color: '#999',
        textAlign: 'center',
        marginBottom: '12px',
        lineHeight: '1.4',
        padding: '0 8px'
      }}>
        {getChainName(chainId)} (Chain ID: {chainId})
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {assets.map((asset) => {
          if (!asset.available) {
            return (
              <div
                key={asset.symbol}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  opacity: 0.5,
                  gap: '8px'
                }}
              >
                <div style={{
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  fontWeight: 'bold',
                  color: '#999',
                  flexShrink: 0
                }}>
                  {asset.symbol}
                </div>
                <div style={{
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  color: '#999',
                  fontStyle: 'italic',
                  textAlign: 'right'
                }}>
                  当前链不支持
                </div>
              </div>
            )
          }
          
          return (
            <div
              key={asset.symbol}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                gap: '8px'
              }}
            >
              <div style={{
                fontSize: 'clamp(14px, 4vw, 16px)',
                fontWeight: 'bold',
                color: '#333',
                flexShrink: 0
              }}>
                {asset.symbol}
              </div>
              <div style={{
                fontSize: 'clamp(13px, 3.8vw, 16px)',
                fontFamily: 'monospace',
                color: '#666',
                textAlign: 'right',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {asset.loading ? '加载中...' : (
                  <span>
                    {parseFloat(asset.balance).toLocaleString('zh-CN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

