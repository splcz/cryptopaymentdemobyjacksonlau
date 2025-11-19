import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { AssetBalance } from './AssetBalance'
import { PayButton } from './PayButton'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()

  // 获取 injected connector（钱包内嵌浏览器中的钱包）
  const injectedConnector = connectors.find((connector) => connector.id === 'injected')

  // 可切换的网络列表（主网和 Sepolia）
  const availableChains = [mainnet, sepolia]

  const handleSwitchChain = (targetChainId: number) => {
    if (chainId !== targetChainId) {
      switchChain({ chainId: targetChainId })
    }
  }

  if (isConnected && address) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '600px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            fontSize: 'clamp(14px, 4vw, 16px)', 
            fontWeight: 'bold' 
          }}>
            钱包已连接
          </div>
          <div style={{
            fontSize: 'clamp(11px, 3vw, 13px)',
            fontFamily: 'monospace',
            color: '#666',
            wordBreak: 'break-all',
            textAlign: 'center',
            padding: '0 8px',
            lineHeight: '1.4'
          }}>
            {address}
          </div>
          
          {/* 网络切换按钮 */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%'
          }}>
            {availableChains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => handleSwitchChain(chain.id)}
                disabled={isSwitching || chainId === chain.id}
                style={{
                  padding: '10px 14px',
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  backgroundColor: chainId === chain.id ? '#4CAF50' : isSwitching ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: chainId === chain.id || isSwitching ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: chainId === chain.id ? 1 : 0.8,
                  minWidth: '100px',
                  flex: '1 1 auto',
                  maxWidth: '200px'
                }}
              >
                {chainId === chain.id ? '✓ ' : ''}
                {chain.name}
                {isSwitching && chainId !== chain.id ? '...' : ''}
              </button>
            ))}
          </div>

          <button
            onClick={() => disconnect()}
            style={{
              padding: '12px 24px',
              fontSize: 'clamp(14px, 4vw, 16px)',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            断开连接
          </button>
        </div>
        <AssetBalance address={address} />
        <PayButton address={address} />
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      width: '100%',
      maxWidth: '400px'
    }}>
      <div style={{ 
        fontSize: 'clamp(16px, 4.5vw, 18px)', 
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        连接钱包
      </div>
      {injectedConnector ? (
        <button
          onClick={() => connect({ connector: injectedConnector })}
          disabled={isPending}
          style={{
            padding: '14px 28px',
            fontSize: 'clamp(14px, 4vw, 16px)',
            backgroundColor: isPending ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          {isPending ? '连接中...' : '连接钱包'}
        </button>
      ) : (
        <div style={{ 
          color: '#ff4444', 
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          textAlign: 'center'
        }}>
          未检测到钱包
        </div>
      )}
    </div>
  )
}

