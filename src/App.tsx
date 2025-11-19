import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { WalletConnect } from './components/WalletConnect'

const queryClient = new QueryClient()

function App() {
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
          paddingTop: '20px',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(24px, 5vw, 32px)', 
            margin: 0,
            textAlign: 'center'
          }}>
            Amount: 0.1 USD
          </h1>
          <WalletConnect />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App

