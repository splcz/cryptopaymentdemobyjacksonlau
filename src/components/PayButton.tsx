import { useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { useChainId } from 'wagmi'
import { parseUnits } from 'viem'
import { useState, useEffect, useRef } from 'react'
import { SelectedToken } from './AssetBalance'

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
const TOKEN_DECIMALS = 6 // USDT 和 USDC 都是 6 位小数

// 根据链ID获取区块链浏览器URL
const getExplorerUrl = (chainId: number, hash: string): string => {
  const explorerUrls: Record<number, string> = {
    1: `https://etherscan.io/tx/${hash}`, // Ethereum Mainnet
    11155111: `https://sepolia.etherscan.io/tx/${hash}`, // Sepolia Testnet
    56: `https://bscscan.com/tx/${hash}`, // BSC Mainnet
    137: `https://polygonscan.com/tx/${hash}`, // Polygon Mainnet
    42161: `https://arbiscan.io/tx/${hash}`, // Arbitrum One
    10: `https://optimistic.etherscan.io/tx/${hash}`, // Optimism
  }
  return explorerUrls[chainId] || `https://etherscan.io/tx/${hash}`
}

interface PayButtonProps {
  address: `0x${string}`
  amount: number
  selectedToken: SelectedToken | null
  onPaymentSuccess?: (success: boolean) => void
}

export function PayButton({ amount, selectedToken, onPaymentSuccess }: PayButtonProps) {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [error, setError] = useState<string | null>(null)
  const isSwitchingRef = useRef(false)

  // 获取选中token的地址
  const selectedTokenAddress = selectedToken 
    ? (TOKEN_ADDRESSES[selectedToken.chainId]?.[selectedToken.token])
    : undefined

  // 如果选择的token不在当前链，需要切换链
  useEffect(() => {
    if (selectedToken && chainId !== selectedToken.chainId && !isSwitchingRef.current && !isSwitching) {
      isSwitchingRef.current = true
      switchChain({ chainId: selectedToken.chainId }, {
        onSuccess: () => {
          isSwitchingRef.current = false
        },
        onError: () => {
          isSwitchingRef.current = false
        }
      })
    } else if (chainId === selectedToken?.chainId) {
      isSwitchingRef.current = false
    }
  }, [selectedToken, chainId, switchChain, isSwitching])

  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // 当支付成功时，通知父组件
  useEffect(() => {
    if (isSuccess && onPaymentSuccess) {
      onPaymentSuccess(true)
    }
  }, [isSuccess, onPaymentSuccess])

  const handlePay = async () => {
    setError(null)
    
    if (!selectedToken) {
      setError('请先选择代币')
      return
    }

    if (!selectedTokenAddress) {
      setError(`当前链不支持 ${selectedToken.token}`)
      return
    }

    // 如果选择的token不在当前链，需要先切换链
    if (chainId !== selectedToken.chainId) {
      setError('正在切换网络，请稍候...')
      return
    }

    try {
      // 将金额转换为正确的单位（USDT 和 USDC 都是 6 位小数）
      const amountInUnits = parseUnits(amount.toString(), TOKEN_DECIMALS)

      writeContract({
        address: selectedTokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [RECIPIENT_ADDRESS, amountInUnits],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '支付失败')
    }
  }

  const isProcessing = isWriting || isConfirming || isSwitching || isSwitchingRef.current
  const isDisabled = isProcessing || !selectedToken || !selectedTokenAddress || isSuccess || chainId !== selectedToken?.chainId

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
          已支付 {amount} {selectedToken?.token}
        </div>
        {hash && selectedToken && (
          <div style={{
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            color: '#666',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            marginTop: '8px'
          }}>
            交易哈希:{' '}
            <a
              href={getExplorerUrl(selectedToken.chainId, hash)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2196F3',
                textDecoration: 'underline',
                cursor: 'pointer',
                wordBreak: 'break-all'
              }}
            >
              {hash}
            </a>
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
          backgroundColor: isDisabled ? '#ccc' : '#333',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        {isSwitching || isSwitchingRef.current ? '切换网络中...' : isWriting ? '准备交易...' : isConfirming ? '确认中...' : !selectedToken ? '请选择代币' : chainId !== selectedToken.chainId ? '等待切换网络...' : !selectedTokenAddress ? `当前链不支持 ${selectedToken.token}` : `支付 ${amount} ${selectedToken.token}`}
      </button>
    </div>
  )
}

