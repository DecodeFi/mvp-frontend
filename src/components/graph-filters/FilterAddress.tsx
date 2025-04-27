import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { truncateAddress } from "@/helpers/truncateAddress"
import { Input } from "@/components/ui/input"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

interface SelectScrollableProps {
  addresses: string[]
  onSelect: (value: string[]) => void
  type: "to" | "from"
}

export function FilterAddress({ addresses, onSelect, type }: SelectScrollableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  const filteredAddresses = useMemo(() => {
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
  const placeHolder = type === "to" ? "Filter target addresses" : "Filter source addresses"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        style={{ backgroundColor: "#f5f5f5" }}
        className="w-[220px] border px-3 py-2 rounded text-left text-sm"
      >
        {selected.length > 0 ? `${selected.length} selected` : placeHolder}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-auto">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[200px] max-h-[300px] overflow-auto bg-white border rounded"
        >
          <div className="px-2 py-1 flex items-center gap-2">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-3/4"
            />
            <Button
              onClick={() => {
                setSelected([])
                setSearchTerm("")
                onSelect([])
              }}
              style={{
                backgroundColor: "transparent",
              }}
            >
              <Trash color={"black"} width={20} height={20} />
            </Button>
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
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
