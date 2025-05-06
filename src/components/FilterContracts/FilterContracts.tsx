import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export const FilterContracts = ({
  contracts,
  selectedContract,
  onSelectContract,
  searchTerm,
  setSearchTerm,
  placeHolder = "Filter contracts",
}: {
  contracts: string[]
  selectedContract: string
  onSelectContract: (contract: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  placeHolder?: string
}) => {
  if (!contracts) return null
  const filteredContracts = contracts?.filter((contract) =>
    contract.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        style={{ backgroundColor: "#f5f5f5" }}
        className="w-[180px] h-[30px] flex items-center border px-3 py-2 rounded text-left text-sm"
      >
        {placeHolder}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-auto">
        <div className="px-2 w-[250px] py-1 flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {filteredContracts.length === 0 && (
          <div className="px-2 text-sm text-gray-400">No contracts found</div>
        )}

        {filteredContracts.map((contract, idx) => (
          <DropdownMenuItem
            key={contract + idx}
            onSelect={() => onSelectContract(contract)}
            className={`capitalize ${selectedContract === contract ? "font-bold" : ""}`}
          >
            {contract}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
