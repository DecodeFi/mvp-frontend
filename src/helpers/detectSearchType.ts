export function detectSearchType(value) {
  if (!value) return null
  if (value.startsWith("0x") && value.length === 66) return "tx"
  if (value.startsWith("0x") && value.length === 42) return "address"
  if (/^\d+$/.test(value)) return "block"
  return "snapshot"
}
