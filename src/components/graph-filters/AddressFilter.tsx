import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { truncateAddress } from "@/helpers/truncateAddress"
import { Input } from "@/components/ui/input"

interface SelectScrollableProps {
  addresses: string[]
  onSelect: (value: string[]) => void
  type: "to" | "from"
}

export function SelectScrollable({ addresses, onSelect, type }: SelectScrollableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selected, setSelected] = React.useState<string[]>([])

  const filteredAddresses = React.useMemo(() => {
    return addresses?.filter((addr) => addr.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [addresses, searchTerm])

  const uniqueFilteredAddresses = Array.from(new Set(filteredAddresses))

  const toggleSelect = (address: string) => {
    setSelected((prev) => {
      const next = prev.includes(address)
        ? prev.filter((a) => a !== address)
        : [...prev, address]
      onSelect(next)
      return next
    })
    setSearchTerm("")
  }
  const placeHolder = type === "to" ? "Select target addresses" : "Select source addresses"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        style={{ backgroundColor: "#f5f5f5" }}
        className="w-[280px] border px-3 py-2 rounded text-left text-sm"
      >
        {selected.length > 0 ? `${selected.length} selected` : placeHolder}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] max-h-[300px] overflow-auto">
        <div className="px-2 py-1">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {uniqueFilteredAddresses.map((address) => (
          <DropdownMenuCheckboxItem
            key={address}
            checked={selected.includes(address)}
            onCheckedChange={() => toggleSelect(address)}
            className="capitalize"
          >
            {truncateAddress(address, 5)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
