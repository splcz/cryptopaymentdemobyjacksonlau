import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { parseUnits } from 'viem'
import { useState, useEffect } from 'react'

// ERC20 ABI - 只需要 transfer 函数
const erc20Abi = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const

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

const RECIPIENT_ADDRESS = '0xecd72934b10d3d2dafba604ab2b1cd1829a79749' as `0x${string}`
const PAYMENT_AMOUNT = 0.1
const TOKEN_DECIMALS = 6 // USDT 和 USDC 都是 6 位小数

type TokenType = 'USDT' | 'USDC'

interface PayButtonProps {
  address: `0x${string}`
}

export function PayButton({}: PayButtonProps) {
  const chainId = useChainId()
  const [error, setError] = useState<string | null>(null)

  // 获取当前链的代币地址
  const tokenAddresses = TOKEN_ADDRESSES[chainId] || {}
  const isUsdtAvailable = !!tokenAddresses.USDT
  const isUsdcAvailable = !!tokenAddresses.USDC

  // 智能默认选择：优先选择 USDT，如果不支持则选择 USDC
  const getDefaultToken = (): TokenType => {
    if (isUsdtAvailable) return 'USDT'
    if (isUsdcAvailable) return 'USDC'
    return 'USDT' // 都不支持时默认 USDT
  }

  const [selectedToken, setSelectedToken] = useState<TokenType>(getDefaultToken())
  const selectedTokenAddress = selectedToken === 'USDT' ? tokenAddresses.USDT : tokenAddresses.USDC

  // 当链切换时，如果当前选择的代币不支持，自动切换到支持的代币
  useEffect(() => {
    if (selectedToken === 'USDT' && !isUsdtAvailable && isUsdcAvailable) {
      setSelectedToken('USDC')
    } else if (selectedToken === 'USDC' && !isUsdcAvailable && isUsdtAvailable) {
      setSelectedToken('USDT')
    }
  }, [chainId, selectedToken, isUsdtAvailable, isUsdcAvailable])

  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handlePay = async () => {
    setError(null)
    
    if (!selectedTokenAddress) {
      setError(`当前链不支持 ${selectedToken}`)
      return
    }

    try {
      // 将 0.1 转换为正确的单位（USDT 和 USDC 都是 6 位小数）
      const amount = parseUnits(PAYMENT_AMOUNT.toString(), TOKEN_DECIMALS)

      writeContract({
        address: selectedTokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [RECIPIENT_ADDRESS, amount],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '支付失败')
    }
  }

  const isProcessing = isWriting || isConfirming
  const isDisabled = isProcessing || !selectedTokenAddress || isSuccess

  if (isSuccess) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '500px',
        padding: '16px',
        border: '1px solid #4CAF50',
        borderRadius: '8px',
        backgroundColor: '#f1f8f4',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: 'clamp(14px, 4vw, 16px)',
          fontWeight: 'bold',
          color: '#4CAF50',
          marginBottom: '8px'
        }}>
          ✓ 支付成功！
        </div>
        <div style={{
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#666',
          marginBottom: '8px'
        }}>
          已支付 {PAYMENT_AMOUNT} {selectedToken}
        </div>
        {hash && (
          <div style={{
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            color: '#666',
            fontFamily: 'monospace',
            wordBreak: 'break-all'
          }}>
            交易哈希: {hash}
          </div>
        )}
      </div>
    )
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
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        支付
      </div>

      {/* 代币选择器 */}
      <div style={{
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#666',
          marginBottom: '8px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          选择支付代币
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setSelectedToken('USDT')}
            disabled={!isUsdtAvailable || isProcessing}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              backgroundColor: selectedToken === 'USDT' ? '#2196F3' : isUsdtAvailable ? '#e3f2fd' : '#f5f5f5',
              color: selectedToken === 'USDT' ? 'white' : isUsdtAvailable ? '#2196F3' : '#999',
              border: selectedToken === 'USDT' ? '2px solid #2196F3' : '2px solid #e0e0e0',
              borderRadius: '6px',
              cursor: isUsdtAvailable && !isProcessing ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              opacity: isUsdtAvailable ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
          >
            USDT
            {!isUsdtAvailable && ' (不支持)'}
          </button>
          <button
            onClick={() => setSelectedToken('USDC')}
            disabled={!isUsdcAvailable || isProcessing}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              backgroundColor: selectedToken === 'USDC' ? '#2196F3' : isUsdcAvailable ? '#e3f2fd' : '#f5f5f5',
              color: selectedToken === 'USDC' ? 'white' : isUsdcAvailable ? '#2196F3' : '#999',
              border: selectedToken === 'USDC' ? '2px solid #2196F3' : '2px solid #e0e0e0',
              borderRadius: '6px',
              cursor: isUsdcAvailable && !isProcessing ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              opacity: isUsdcAvailable ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
          >
            USDC
            {!isUsdcAvailable && ' (不支持)'}
          </button>
        </div>
      </div>

      <div style={{
        fontSize: 'clamp(12px, 3.5vw, 14px)',
        color: '#666',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        支付金额: {PAYMENT_AMOUNT} {selectedToken}
      </div>
      <div style={{
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        color: '#999',
        marginBottom: '16px',
        textAlign: 'center',
        fontFamily: 'monospace',
        wordBreak: 'break-all',
        padding: '0 8px'
      }}>
        收款地址: {RECIPIENT_ADDRESS}
      </div>
      
      {error && (
        <div style={{
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#ff4444',
          marginBottom: '12px',
          textAlign: 'center',
          padding: '8px',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {writeError && (
        <div style={{
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#ff4444',
          marginBottom: '12px',
          textAlign: 'center',
          padding: '8px',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px'
        }}>
          错误: {writeError.message}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={isDisabled}
        style={{
          width: '100%',
          padding: '14px 28px',
          fontSize: 'clamp(14px, 4vw, 16px)',
          backgroundColor: isDisabled ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        {isWriting ? '准备交易...' : isConfirming ? '确认中...' : !selectedTokenAddress ? `当前链不支持 ${selectedToken}` : `支付 ${PAYMENT_AMOUNT} ${selectedToken}`}
      </button>
    </div>
  )
}

