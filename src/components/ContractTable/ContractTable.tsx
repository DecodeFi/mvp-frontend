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
import { AddressInfo } from "../../../backend/apiSlice"
import { publicClient } from "@/helpers/client"
import { useEffect, useState } from "react"
import { truncateAddress } from "@/helpers/truncateAddress"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
]

export function ContractTable({ data }: { data: AddressInfo }) {
  const [balance, setBalance] = useState<number>()
  if (!data) return null
  useEffect(() => {
    const fetchBalance = async () => {
      const fetchedBalance = await publicClient.getBalance({
        address: data.address,
      })
      if (fetchedBalance) setBalance(Number(balance))
    }
    fetchBalance()
  }, [data])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Address</TableHead>
          <TableHead>Contract Name</TableHead>
          <TableHead>Source Code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key={data.contractBytecode}>
          <TableCell className="font-medium">{truncateAddress(data.address, 7)}</TableCell>
          <TableCell>{data.contractName}</TableCell>
          <TableCell>View Source Code</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>TVL</TableCell>
          <TableCell className="text-right">{balance}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
