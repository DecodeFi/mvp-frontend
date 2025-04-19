export const truncateAddress = (
  address: string,
  visibleCharacters: number,
  prefixCharacters?: number,
  suffixCharacters?: number,
) => {
  if (address) {
    const prefixLength = prefixCharacters ?? visibleCharacters;
    const suffixLength = suffixCharacters ?? visibleCharacters;

    if (address.length <= prefixLength + suffixLength + 2) {
      return address;
    }
    const prefix = address.slice(0, prefixLength + 1);
    const suffix = address.slice(-suffixLength);

    return `${prefix}...${suffix}`;
  }
  return "";
};
