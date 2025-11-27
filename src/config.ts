import { createConfig, http, injected } from 'wagmi'
import { mainnet, sepolia, bsc } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, bsc],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
  },
})

