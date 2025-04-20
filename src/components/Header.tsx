import styles from "./Header.module.css";

export const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <p
        style={{
          fontSize: "48px",
          color: "#FF0071",
          fontWeight: "bold",
          padding: "8px 16px",
          borderRadius: "12px",
          letterSpacing: "0.5px",
          width: "fit-content",
        }}
      >
        GraphChain
      </p>
      <p>Currently supporting Ethereum Transactions and Uniswap contracts</p>
    </div>
  );
};
