import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { truncateAddress } from "@/helpers/truncateAddress"

interface SelectScrollableProps {
  addresses: string[]
  onSelect: (value: string) => void
}

export function SelectScrollable({ addresses, onSelect }: SelectScrollableProps) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select an address to display" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {addresses?.map((address) => (
            <SelectItem key={address} value={address}>
              {truncateAddress(address, 5)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
