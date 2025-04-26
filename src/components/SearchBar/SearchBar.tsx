import styles from "./SearchBar.module.css"
import searchIcon from "@/assets/search-icon.svg"

type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

export const SearchBar = ({ value, onChange, onSubmit }: Props) => {
  return (
    <form
      className={styles.searchBar}
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
        placeholder="Search for addresses, transactions or blocks"
        value={value}
        onChange={onChange}
      />
    </form>
  )
}
