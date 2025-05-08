import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued"
import levenshtein from "js-levenshtein"
import React, { useMemo } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface ContractDiffViewerProps {
  oldSource: string
  newSource: string
}

export function ContractDiffViewer({ oldSource, newSource }: ContractDiffViewerProps) {
  const isSimilar = useMemo(() => {
    const clean = (str: string) => str.replace(/\/\/.*|\/\*[^]*?\*\//g, "").replace(/\s+/g, "")
    const a = clean(oldSource)
    const b = clean(newSource)
    const maxLen = Math.max(a.length, b.length)
    if (maxLen === 0) return true
    const dist = levenshtein(a, b)
    const similarityRatio = 1 - dist / maxLen
    return similarityRatio > 0.7
  }, [oldSource, newSource])
  if (!isSimilar) {
    return (
      <div style={{ display: "flex", gap: "1rem", maxHeight: "40rem" }}>
        <div
          style={{
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!isSimilar && (
            <div className="p-4">These are two different files. No changes shown</div>
          )}
          <div className="flex gap-2">
            <SyntaxHighlighter
              language="solidity"
              customStyle={{ maxHeight: "450px", fontSize: "small", margin: 0, width: "50%" }}
              style={coy}
              wrapLongLines
            >
              {oldSource}
            </SyntaxHighlighter>
            <SyntaxHighlighter
              language="solidity"
              customStyle={{ maxHeight: "450px", fontSize: "small", margin: 0, width: "50%" }}
              style={coy}
              wrapLongLines
            >
              {newSource}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <ReactDiffViewer
        oldValue={oldSource}
        newValue={newSource}
        splitView={true}
        compareMethod={DiffMethod.LINES}
        showDiffOnly={false}
        hideLineNumbers={false}
        useDarkTheme={false}
      />
    </div>
  )
}
