import React, { useCallback, useEffect, useMemo, useState } from "react"
import css from "./App.module.css"
import { Header } from "./components/Header"
import "@xyflow/react/dist/style.css"
import { applyEdgeChanges, applyNodeChanges, Background, ReactFlow } from "@xyflow/react"
import NodeHeaderComponent from "@/components/graph-nodes/NodeHeaderComponent"
import { SearchBar } from "@/components/SearchBar"
import {
  useGetAddressQuery,
  useGetLatestBlockNumberQuery,
  useGetTxsQuery,
} from "../backend/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import { detectSearchType } from "@/helpers/detectSearchType"
import { buildGraphFromData } from "@/helpers/buildGraphFromData"
import { SelectAddress } from "@/components/graph-filters/SelectAddress"
import { IBlockData } from "@/types/IBlockData"

const nodeTypes = {
  nodeHeaderNode: NodeHeaderComponent,
}

function App() {
  const [fromFilter, setFromFilter] = useState<string[]>([])
  const [toFilter, setToFilter] = useState<string[]>([])
  const [actionFilter, setActionFilter] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const searchType = detectSearchType(searchValue)
  const {
    data: blockData,
    isLoading: isLoadingBLockData,
    error,
  } = useGetLatestBlockNumberQuery(searchType === "block" ? searchValue : skipToken)
  const uniqueBlockData = useMemo(() => {
    const seen = new Set()
    return (Array.isArray(blockData) ? blockData : []).filter((item) => {
      const key = `${item.from_addr}-${item.to_addr}-${item.storage_addr}-${item.action}`

      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [blockData])

  const { data: txDataRaw, isLoading: isLoadingTxDataRaw } = useGetTxsQuery(
    searchType === "tx" ? searchValue : skipToken
  )
  const { data: addressDataRaw, isLoading: isLoadingAddressDataRaw } = useGetAddressQuery(
    searchType === "address" ? searchValue : skipToken
  )

  const parsedTxData = useMemo(() => {
    try {
      if (txDataRaw?.result) return JSON.parse(txDataRaw.result)
    } catch (e) {
      console.error("Failed to parse txDataRaw", e)
    }
    return []
  }, [txDataRaw])

  const rawData =
    searchType === "block"
      ? uniqueBlockData || addressDataRaw
      : searchType === "tx"
        ? parsedTxData
        : searchType === "address"
          ? addressDataRaw
          : []

  const filteredData: IBlockData[] = rawData?.filter((tx) => {
    return (
      (!fromFilter.length || fromFilter.includes(tx.from_addr)) &&
      (!toFilter.length || toFilter.includes(tx.to_addr)) &&
      (!actionFilter || tx.action === actionFilter)
    )
  })

  const { nodes, edges } = useMemo(() => buildGraphFromData(filteredData), [filteredData])

  useEffect(() => {
    if (blockData || addressDataRaw) setNodes(nodes)
    setEdges(edges)
  }, [blockData, txDataRaw, addressDataRaw, fromFilter, toFilter, actionFilter])
  const [nodes_, setNodes] = useState(nodes)
  const [edges_, setEdges] = useState(edges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [blockData, txDataRaw, filteredData, addressDataRaw]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [blockData, txDataRaw, filteredData, addressDataRaw]
  )
  return (
    <div className={css.container}>
      <Header />
      <div className="flex justify-center">
        <SearchBar
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSubmit={() => setSearchValue(searchInput)}
        />
      </div>
      {(isLoadingBLockData || isLoadingAddressDataRaw || isLoadingTxDataRaw) && (
        <div>loading...</div>
      )}

      <div
        style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <SelectAddress
          addresses={rawData?.map(({ from_addr }) => from_addr)}
          onSelect={setFromFilter}
          type="from"
        />
        <SelectAddress
          addresses={rawData?.map(({ to_addr }) => to_addr)}
          onSelect={setToFilter}
          type="to"
        />
      </div>
      <div className={css.graphContainer}>
        <style>{`.react-flow__attribution { display: none !important; }`}</style>
        <style>{`.react-flow__node {user-select: text !important;}`}</style>
        <style>{`.react-flow__node.draggable {cursor: default !important;}`}</style>
        <ReactFlow
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          nodes={nodes_}
          edges={edges_}
          nodeTypes={nodeTypes}
          onInit={(instance) => instance.setViewport({ x: 300, y: 0, zoom: 0.5 })}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App
