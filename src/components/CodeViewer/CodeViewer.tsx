import React, { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface ContractSourceViewerProps {
  sources: Record<string, { content: string }>
}

export function ContractSourceViewer({ sources }: ContractSourceViewerProps) {
  const fileNames = Object.keys(sources)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)

  const currentFileName = fileNames[currentFileIndex]
  const currentContent = sources[currentFileName]?.content || ""

  const handleNext = () => {
    setCurrentFileIndex((prev) => (prev + 1) % fileNames.length)
  }

  const handlePrevious = () => {
    setCurrentFileIndex((prev) => (prev - 1 + fileNames.length) % fileNames.length)
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="text-sm text-gray-500">
        File {currentFileIndex + 1} of {fileNames.length} : {currentFileName}
      </div>
      <div
        style={{
          width: "100%",
          maxHeight: "600px",
          overflowY: "auto",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
      >
        <SyntaxHighlighter
          language="solidity"
          style={vscDarkPlus}
          wrapLongLines
          customStyle={{ padding: "1rem", fontSize: "14px" }}
        >
          {currentContent}
        </SyntaxHighlighter>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}
