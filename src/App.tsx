import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { WalletConnect } from './components/WalletConnect'
import { useState, useEffect, useRef } from 'react'

const queryClient = new QueryClient()

function App() {
  // 从URL查询参数获取金额，如果没有则默认为0.1
  const getAmountFromUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const amountParam = params.get('amount')
    if (amountParam) {
      const parsed = parseFloat(amountParam)
      return isNaN(parsed) || parsed <= 0 ? 0.1 : parsed
    }
    return 0.1
  }

  const [amount, setAmount] = useState<number>(getAmountFromUrl())
  const amountRef = useRef(amount)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)

  // 更新ref当amount变化时
  useEffect(() => {
    amountRef.current = amount
  }, [amount])

  // 当URL查询参数变化时更新金额
  useEffect(() => {
    const handleLocationChange = () => {
      const newAmount = getAmountFromUrl()
      if (newAmount !== amountRef.current) {
        setAmount(newAmount)
      }
    }
    
    // 监听popstate事件（浏览器前进/后退）
    window.addEventListener('popstate', handleLocationChange)
    
    // 定期检查URL变化（用于直接修改URL的情况）
    const interval = setInterval(() => {
      const newAmount = getAmountFromUrl()
      if (newAmount !== amountRef.current) {
        setAmount(newAmount)
      }
    }, 100)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif',
          gap: '16px',
          padding: '16px',
          paddingTop: '60px',
          boxSizing: 'border-box',
          backgroundColor: '#F5F5F5'
        }}>
          {!isPaymentSuccess && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              maxWidth: '500px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                maxWidth: '300px'
              }}>
                <label style={{
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  金额:
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    const newAmount = parseFloat(e.target.value)
                    if (!isNaN(newAmount) && newAmount >= 0) {
                      setAmount(newAmount)
                      // 更新URL查询参数
                      const params = new URLSearchParams(window.location.search)
                      params.set('amount', newAmount.toString())
                      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    fontSize: 'clamp(14px, 4vw, 16px)',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                />
                <span style={{
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  USD
                </span>
              </div>
            </div>
          )}
          <WalletConnect amount={amount} onPaymentSuccess={setIsPaymentSuccess} />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App

