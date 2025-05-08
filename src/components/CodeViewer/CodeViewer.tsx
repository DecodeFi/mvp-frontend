import React, { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { FilterContracts, SearchBar } from "@/components"
import { ContractDiffViewer } from "@/components/CodeViewer/DiffViewer"
import { useGetAddressInfoQuery, useGetAddressQuery } from "../../../backend/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"

interface ContractSourceViewerProps {
  sources: Record<string, { content?: string }>
}

export function ContractSourceViewer({ sources }: ContractSourceViewerProps) {
  const fileNames = Object.keys(sources)
  const [viewMode, setViewMode] = useState<"view" | "diff">("view")
  const [searchInput, setSearchInput] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [selectedContract, setSelectedContract] = useState<string>(fileNames[0] || "")
  const [compareToContract, setCompareToContract] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  const { data } = useGetAddressInfoQuery(searchValue)
  const isJSON = data?.contractSourceCode?.startsWith("{{")
  const cleanedRawContractSource = isJSON
    ? data?.contractSourceCode.trim().replace(/^{{/, "{").replace(/}}$/, "}")
    : data?.contractSourceCode

  const parsedSources = isJSON
    ? JSON.parse(cleanedRawContractSource)?.sources || {}
    : { [data?.contractName]: cleanedRawContractSource }

  const currentFileContent = sources[selectedContract]?.content || ""
  const compareToContent = parsedSources[compareToContract]?.content || ""
  const isDiffMode = viewMode === "diff"
  if (fileNames.length === 0) return <div>No contract files found.</div>
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-between">
        <div className="text-sm text-gray-600">Mode:</div>
        <button
          style={{ borderColor: !isDiffMode && "#FF0071" }}
          onClick={() => setViewMode("view")}
          className="px-2 py-1 border rounded"
        >
          View
        </button>
        <button
          style={{ borderColor: isDiffMode && "#FF0071" }}
          onClick={() => setViewMode("diff")}
          className="px-2 py-1 border rounded"
        >
          Compare
        </button>
      </div>
      {viewMode === "diff" && (
        <div className="m-auto">
          <SearchBar
            placeholder="insert the address to compare"
            value={searchInput}
            clearValue={() => setSearchInput("")}
            className="w-[300px]"
            onChange={(e) => setSearchInput(e.target.value)}
            onSubmit={() => {
              setSearchValue(searchInput)
            }}
          />
        </div>
      )}
      <div className="flex justify-between gap-4 items-center">
        <FilterContracts
          contracts={fileNames}
          placeHolder="Choose the file"
          selectedContract={selectedContract}
          onSelectContract={setSelectedContract}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex items-center gap-3">
          {viewMode === "diff" &&
            parsedSources &&
            !Object.keys(parsedSources).includes("undefined") && (
              <FilterContracts
                contracts={Object.keys(parsedSources)}
                selectedContract={compareToContract}
                onSelectContract={setCompareToContract}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
        </div>
      </div>

      {viewMode === "view" && (
        <div
          style={{
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "15px",
          }}
        >
          <SyntaxHighlighter
            language="solidity"
            customStyle={{ maxHeight: "450px", fontSize: "small", margin: 0 }}
            style={coy}
            wrapLongLines
          >
            {currentFileContent}
          </SyntaxHighlighter>
        </div>
      )}

      {viewMode === "diff" && compareToContract && (
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #ccc",
            borderRadius: "15px",
          }}
        >
          <ContractDiffViewer oldSource={compareToContent} newSource={currentFileContent} />
        </div>
      )}
    </div>
  )
}
