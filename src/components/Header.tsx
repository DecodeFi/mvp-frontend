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
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "24px",
          color: "#FCEEEF",

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
