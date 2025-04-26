import { http, createPublicClient } from "viem"
import { mainnet } from "viem/chains"

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://ethereum-rpc.publicnode.com"),
})
