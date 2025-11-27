import { useAtomValue } from 'jotai';
import { useBalance, useReadContracts } from 'wagmi'
import { preOrderDetailAtom } from '../pages/pay';
import { STABLE_TOKENS } from '../lib/tokens';
import { erc20Abi, formatUnits } from 'viem';

// 支持的链和代币配置
const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum' },
  { id: 11155111, name: 'Sepolia' },
]

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
}

type TokenType = 'USDT' | 'USDC'

export interface SelectedToken {
  chainId: number
  token: TokenType
  chainName: string
	paymentAddress: `0x${string}`
}

interface AssetBalanceProps {
  address: `0x${string}`
  selectedToken: SelectedToken | null
  onTokenSelect: (token: SelectedToken) => void
}

// 单个资产项组件，用于调用useBalance hook
function AssetItem({ 
  chainId, 
  chainName, 
  token, 
  tokenAddress, 
  address, 
  isSelected, 
  onSelect 
}: { 
  chainId: number
  chainName: string
  token: TokenType
  tokenAddress?: `0x${string}`
  address: `0x${string}`
  isSelected: boolean
  onSelect: () => void
}) {
  const { data: balance, isLoading } = useBalance({
    address,
    token: tokenAddress,
    chainId: chainId,
    query: {
      enabled: !!tokenAddress && !!address,
    },
  })

	// // 单个useReadContracts循环调用
	// const allChainIds = [1, 11155111, 56] as const;

	// const { data: balances } = useReadContracts({
	// 	contracts: allChainIds.flatMap(chainId => 
	// 		Object.values(STABLE_TOKENS[chainId] || {}).map(token => ({
	// 			address: token.address,
	// 			abi: erc20Abi,
	// 			functionName: 'balanceOf',
	// 			args: [address],
	// 			chainId: token.chainId
	// 		}))
	// 	)
	// });

	// // 处理结果
	// balances?.forEach((item, index) => {
	// 	const allTokens = allChainIds.flatMap(id => Object.values(STABLE_TOKENS[id] || {}));
	// 	const token = allTokens[index];
		
	// 	if (item.result) {
	// 		console.log(
	// 			formatUnits(item.result, token.decimals),
	// 			`${token.symbol} on chain ${token.chainId}`
	// 		);
	// 	}
	// });

  const available = !!tokenAddress
  const balanceFormatted = balance?.formatted || '0.00'

  return (
    <div
      onClick={() => available && onSelect()}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: isSelected ? '#e3f2fd' : available ? '#f5f5f5' : '#f9f9f9',
        borderRadius: '6px',
        border: isSelected ? '2px solid #2196F3' : '1px solid #e0e0e0',
        gap: '8px',
        cursor: available ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s',
        opacity: available ? 1 : 0.5
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
      }}>
        {isSelected && (
          <span style={{
            fontSize: 'clamp(14px, 4vw, 16px)',
            color: '#2196F3',
            fontWeight: 'bold'
          }}>
            ✓
          </span>
        )}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <div style={{
            fontSize: 'clamp(14px, 4vw, 16px)',
            fontWeight: 'bold',
            color: isSelected ? '#2196F3' : available ? '#333' : '#999',
          }}>
            {token}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            color: isSelected ? '#2196F3' : '#999',
            fontWeight: 'normal'
          }}>
            {chainName}
          </div>
        </div>
      </div>
      <div style={{
        fontSize: 'clamp(13px, 3.8vw, 16px)',
        fontFamily: 'monospace',
        color: isSelected ? '#2196F3' : available ? '#666' : '#999',
        textAlign: 'right',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }}>
        {isLoading ? '加载中...' : (
          <span>
            {parseFloat(balanceFormatted).toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export function AssetBalance({ address, selectedToken, onTokenSelect }: AssetBalanceProps) {
	const { data: preOrderDetail } = useAtomValue(preOrderDetailAtom)
	const params = new URLSearchParams(window.location.search)
	const walletName = params.get('walletName')
	
  // 为所有链上的所有token创建资产列表
  const allAssets = SUPPORTED_CHAINS.flatMap(chain => {
    const tokenAddresses = TOKEN_ADDRESSES[chain.id] || {}
    const tokens: TokenType[] = ['USDT', 'USDC']
    
    return tokens.map(token => ({
      chainId: chain.id,
      chainName: chain.name,
      token: token as TokenType,
      tokenAddress: tokenAddresses[token as TokenType],
    }))
  })

	const onSelect = (asset: Omit<SelectedToken, 'paymentAddress'>) => {
		const wallet = preOrderDetail?.web3Wallets.find((wallet:any) => wallet.walletName === walletName)
		const paymentAddress = wallet?.chains.find((chain:any) => chain.chain === asset.chainName)?.paymentAddress
		onTokenSelect({
			chainId: asset.chainId,
			token: asset.token,
			chainName: asset.chainName,
			paymentAddress: paymentAddress
		})
	}

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
        选择Token
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {allAssets.map((asset) => {
          const isSelected = selectedToken?.chainId === asset.chainId && selectedToken?.token === asset.token
          
          return (
            <AssetItem
              key={`${asset.chainId}-${asset.token}`}
              chainId={asset.chainId}
              chainName={asset.chainName}
              token={asset.token}
              tokenAddress={asset.tokenAddress}
              address={address}
              isSelected={isSelected}
              onSelect={() => onSelect(asset)}
            />
          )
        })}
        <button
          style={{
            padding: '12px 16px',
            fontSize: 'clamp(14px, 4vw, 16px)',
            backgroundColor: '#f5f5f5',
            color: '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            marginTop: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e8e8e8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
        >
          选择更多Token
        </button>
      </div>
    </div>
  )
}

