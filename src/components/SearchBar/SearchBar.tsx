import styles from "./SearchBar.module.css"
import searchIcon from "@/assets/search-icon.svg"
import { ChangeEvent } from "react"
import { cn } from "@/lib/utils"

type Props = {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  className?: string
  placeholder?: string
}

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  className,
  placeholder = "search for blocks, addresses, protocols",
}: Props) => {
  return (
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
  )
}
