import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddressInfo, useGetAddressInfoQuery } from "../../../backend/apiSlice"
import { publicClient } from "@/helpers/client"
import React, { useEffect, useState } from "react"
import { truncateAddress } from "@/helpers/truncateAddress"
import { formatEther } from "viem"
import { CopyButton } from "@/components/ui/CopyButton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function ContractTable({ address }: { address: string }) {
  const { data } = useGetAddressInfoQuery(address)
  const [balance, setBalance] = useState<number>()
  if (!address) return null
  useEffect(() => {
    const fetchBalance = async () => {
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
      if (calculatedTVL) {
        const formatted = calculatedTVL.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        setBalance(formatted)
      }
    }
    fetchBalance()
  }, [data])

  return (
    <div className={"p-4"}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Contract Name</TableHead>
            <TableHead>Source Code</TableHead>
            <TableHead>TVL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={data.contractBytecode}>
            <TableCell className="font-medium">
              <div className={"flex gap-2 items-center"}>
                <p>{truncateAddress(data.address, 7)}</p>
                <CopyButton text={data.address as string} />
              </div>
            </TableCell>
            <TableCell>
              <div className={"flex gap-2 items-center"}>
                <p>{data.contractName}</p>
                {data.isProxy && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p
                          style={{
                            border: "1px dashed #FF0071",
                            color: "#FF0071",
                            borderRadius: "10px",
                            padding: "2px 4px",
                          }}
                        >
                          Proxy
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is a proxy contract</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                {data?.contractSourceCode ? (
                  <Button
                    style={{
                      border: "1px dashed #FF0071",
                      color: "#FF0071",
                      borderRadius: "10px",
                      padding: "2px 4px",
                    }}
                  >
                    Source Code
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p
                          style={{
                            border: "1px dashed red",
                            color: "red",
                            borderRadius: "10px",
                            padding: "2px 4px",
                            width: "fit-content",
                          }}
                        >
                          Source code unavailable
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is a proxy contract</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </TableCell>
            <TableCell>${balance?.toLocaleString("en-US")}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
