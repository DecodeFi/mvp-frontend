import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetAddressInfoQuery } from "../../../backend/apiSlice"
import { useBalance } from "@/hooks/useBalance"
import { truncateAddress } from "@/helpers/truncateAddress"
import { CopyButton } from "@/components/ui/CopyButton"
import React, { memo, useEffect, useState } from "react"
import {
  ContractNameWithProxyTag,
  ContractSourceViewer,
  SourceCodeToggleButton,
} from "@/components"

const ContractTable = ({ address }: { address: string }) => {
  const [isToggledSourceCode, setIsToggledSourceCode] = useState(false)
  const { data } = useGetAddressInfoQuery(address)
  const balance = useBalance(address)

  useEffect(() => {
    setIsToggledSourceCode(false)
  }, [address])

  if (!data) return null

  const isJSON = data.contractSourceCode?.startsWith("{{")
  const cleanedRawContractSource = isJSON
    ? data.contractSourceCode.trim().replace(/^{{/, "{").replace(/}}$/, "}")
    : data.contractSourceCode

  const parsedSources = isJSON
    ? JSON.parse(cleanedRawContractSource)?.sources || {}
    : { [data.contractName]: cleanedRawContractSource }

  return (
    <div className="p-4 ">
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
              <div className="flex gap-2 items-center">
                <p>{truncateAddress(data.address, 7)}</p>
                <CopyButton text={data.address} />
              </div>
            </TableCell>
            <TableCell>
              <ContractNameWithProxyTag name={data.contractName} isProxy={data.isProxy} />
            </TableCell>
            <TableCell>
              <SourceCodeToggleButton
                hasSourceCode={!!data.contractSourceCode}
                onToggle={() => setIsToggledSourceCode((prev) => !prev)}
                isToggled={isToggledSourceCode}
              />
            </TableCell>
            <TableCell>
              {balance !== undefined
                ? `$${balance.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                : "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {isToggledSourceCode && <ContractSourceViewer sources={parsedSources} />}
    </div>
  )
}

ContractTable.displayName = "ContractTable"

export const ContractTableComponent = memo(ContractTable)
