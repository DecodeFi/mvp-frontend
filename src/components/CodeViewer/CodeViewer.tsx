import SyntaxHighlighter from "react-syntax-highlighter"
import atelierCaveDark from "react-syntax-highlighter/dist/esm/styles/hljs/atelier-cave-dark"

export function ContractCodeViewer({ code }: { code: string }) {
  if (!code) return null

  return (
    <div
      style={{
        maxHeight: "600px",
        overflowY: "auto",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    >
      <SyntaxHighlighter language="solidity" style={atelierCaveDark} wrapLongLines>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
