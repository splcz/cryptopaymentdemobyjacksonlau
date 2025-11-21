import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { AssetBalance, SelectedToken } from './AssetBalance'
import { PayButton } from './PayButton'
import { useState, useEffect } from 'react'

interface WalletConnectProps {
  amount: number
  onPaymentSuccess?: (success: boolean) => void
}

export function WalletConnect({ amount, onPaymentSuccess }: WalletConnectProps) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // 默认不选择任何token，让用户手动选择
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(null)
  // 支付成功状态
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)

  // 当支付成功时，通知父组件
  useEffect(() => {
    if (onPaymentSuccess) {
      onPaymentSuccess(isPaymentSuccess)
    }
  }, [isPaymentSuccess, onPaymentSuccess])

  useEffect(() => {
    // 自动连接钱包
    setTimeout(() => {
      if (injectedConnector && !isConnected && !isPending) {
        connect({ connector: injectedConnector })
      }
    }, 1000)
  }, [])

  // 获取 injected connector（钱包内嵌浏览器中的钱包）
  const injectedConnector = connectors.find((connector) => connector.id === 'injected')

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
        {!isPaymentSuccess && (
          <AssetBalance 
            address={address} 
            selectedToken={selectedToken}
            onTokenSelect={setSelectedToken}
          />
        )}
        <PayButton 
          address={address} 
          amount={amount} 
          selectedToken={selectedToken}
          onPaymentSuccess={setIsPaymentSuccess}
        />
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
      {injectedConnector ? (
        <button
          onClick={() => connect({ connector: injectedConnector })}
          disabled={isPending}
          style={{
            padding: '14px 28px',
            fontSize: 'clamp(14px, 4vw, 16px)',
            backgroundColor: isPending ? '#ccc' : '#333',
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

