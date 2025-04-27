import React, { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { FilterContracts } from "@/components/CodeViewer/FilterContracts"
import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface ContractSourceViewerProps {
  sources: Record<string, { content: string }>
}

export function ContractSourceViewer({ sources }: ContractSourceViewerProps) {
  const fileNames = Object.keys(sources)

  const [selectedContract, setSelectedContract] = useState<string>(fileNames[0] || "")
  const [searchTerm, setSearchTerm] = useState("")

  if (fileNames.length === 0) return <div>No contract files found.</div>

  const currentFileContent = sources[selectedContract]?.content || ""

  const handleSelectContract = (contract: string) => {
    setSelectedContract(contract)
  }

  return (
    <div className="flex flex-col gap-4 ">
      <div>
        <div className="text-center text-gray-600 text-sm">{selectedContract}</div>
        <FilterContracts
          contracts={fileNames}
          selectedContract={selectedContract}
          onSelectContract={handleSelectContract}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div
        style={{
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "15px",
        }}
      >
        <SyntaxHighlighter
          language="solidity"
          customStyle={{
            maxHeight: "450px",
            fontSize: "small",
            margin: 0,
          }}
          style={coy}
          wrapLongLines
        >
          {currentFileContent}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
