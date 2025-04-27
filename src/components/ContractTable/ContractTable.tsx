import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetAddressInfoQuery } from "../../../backend/apiSlice"
import React, { useEffect, useState } from "react"
import { truncateAddress } from "@/helpers/truncateAddress"
import SyntaxHighlighter from "react-syntax-highlighter"
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { CopyButton } from "@/components/ui/CopyButton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function ContractTable({ address }: { address: string }) {
  const [isToggledSourceCode, setIsToggledSourceCode] = useState<boolean>(false)
  const { data } = useGetAddressInfoQuery(address)
  const cleanedRawContractSource = data?.contractSourceCode
    .trim()
    .replace(/^{{/, "{")
    .replace(/}}$/, "}")

  let parsedSources = {}

  const parsed = JSON.parse(cleanedRawContractSource)
  parsedSources = parsed?.sources || {}
  const fileNames = Object.keys(parsedSources)
  const currentFileName = fileNames[0]
  const currentFileContent = parsedSources[currentFileName].content
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
    <div className={"p-4 "}>
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
                    onClick={() => setIsToggledSourceCode((prev) => !prev)}
                    style={{
                      border: "1px dashed #FF0071",
                      color: "#FF0071",
                      borderRadius: "10px",
                      padding: "2px 4px",
                    }}
                  >
                    {isToggledSourceCode ? "Hide Source Code" : "Source Code"}
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
      {isToggledSourceCode && (
        <div className={" overflow-y-auto"}>
          <SyntaxHighlighter
            customStyle={{ maxHeight: "400px" }}
            language="solidity"
            style={docco}
          >
            {currentFileContent}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  )
}
