import { useEffect, useState } from "react"

export const useBalance = (address: string) => {
  const [balance, setBalance] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!address) return

    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`,
          {
            headers: {
              "X-API-Key":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjI2NGQzYWJmLTk3ODYtNDY0OC04MTdhLWY2ZWNjZmJjZGRjYSIsIm9yZ0lkIjoiNDQzOTkyIiwidXNlcklkIjoiNDU2ODExIiwidHlwZUlkIjoiZjlmYzg5ZTAtZTgzZS00ODNkLWI3ZjItYjNhNmYxZjBjN2Y4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDU2ODQxMTIsImV4cCI6NDkwMTQ0NDExMn0.TM59cMxNe1it1fqKOauiqS5V6IoaR3AvINl7tuQ6cbA",
            },
          }
        )
        const data = await response.json()
        const calculatedTVL = data?.result?.reduce((sum, token) => {
          const balance = parseFloat(token.balance_formatted || "0")
          const price = token.usd_price || 0
          return sum + balance * price
        }, 0)

        if (calculatedTVL) setBalance(calculatedTVL)
      } catch (error) {
        console.error("Failed to fetch balance", error)
      }
    }

    fetchBalance()
  }, [address])

  return balance
}
