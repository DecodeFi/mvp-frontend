import styles from "./SearchBar.module.css"
import searchIcon from "@/assets/search-icon.svg"
import { ChangeEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Props = {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  className?: string
  placeholder?: string
  clearValue: () => void
}

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  className,
  clearValue,
  placeholder = "search for blocks, addresses, protocols",
}: Props) => {
  return (
    <div className="flex gap-2 w-full justify-center">
      <form
        className={cn(styles.searchBar, className)}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <span className={styles.icon}>
          <img width={16} height={16} src={searchIcon} />
        </span>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </form>
      <Button onClick={clearValue} style={{ width: "3rem", backgroundColor: "#f5f5f5" }}>
        Clear
      </Button>
    </div>
  )
}
