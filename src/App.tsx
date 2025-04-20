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
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SelectScrollable } from "@/components/graph-filters/AddressFilter"
import { IBlockData } from "@/types/IBlockData"

const nodeTypes = {
  nodeHeaderNode: NodeHeaderComponent,
}

// const sampleData = [
//   {
//     hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
//     from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
//     to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
//     storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
//     value: "0x3e5500",
//     action: "call",
//   },
//   {
//     hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
//     from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
//     to: "dadsda",
//     storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
//     value: "0x3e5500",
//     action: "call",
//   },
//   {
//     hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
//     from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
//     to: "dadaaaaaasda",
//     storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
//     value: "0x3e5500",
//     action: "call",
//   },
//   {
//     hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
//     from: "dadaaaaaasda",
//     to: "ффффффф",
//     storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
//     value: "0x3e5500",
//     action: "call",
//   },
//   {
//     hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
//     from: "уууу",
//     to: "фффффуккфф",
//     storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
//     value: "0x3e5500",
//     action: "call",
//   },
// ];
//22261635
function App() {
  const [fromFilter, setFromFilter] = useState("")
  const [toFilter, setToFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [searchValue, setSearchValue] = useState("22261635")
  const searchType = detectSearchType(searchValue)

  const {
    data: blockData,
    isLoading: isLoadingBLockData,
    error,
  } = useGetLatestBlockNumberQuery(searchType === "block" ? searchValue : skipToken)
  console.log("blockData", blockData)
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

  const parsedAddressData = useMemo(() => {
    try {
      if (addressDataRaw?.result) return JSON.parse(addressDataRaw.result)
    } catch (e) {
      console.error("Failed to parse addressDataRaw", e)
    }
    return []
  }, [addressDataRaw])
  const rawData =
    searchType === "block"
      ? blockData
      : searchType === "tx"
        ? parsedTxData
        : searchType === "address"
          ? parsedAddressData
          : []
  const filteredData: IBlockData[] = rawData?.filter((tx) => {
    return (
      (!fromFilter || tx.from.includes(fromFilter)) &&
      (!toFilter || tx.to.includes(toFilter)) &&
      (!actionFilter || tx.action === actionFilter)
    )
  })
  console.log("filteredData", filteredData)
  const { nodes, edges } = useMemo(() => buildGraphFromData(filteredData), [filteredData])
  useEffect(() => {
    if (blockData) setNodes(nodes)
    setEdges(edges)
  }, [blockData, fromFilter, toFilter, actionFilter])
  const [nodes_, setNodes] = useState(nodes)
  const [edges_, setEdges] = useState(edges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [blockData]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [blockData]
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
        <SelectScrollable addresses={filteredData?.map(({ from_addr }) => from_addr)} />
        <input
          placeholder="Search to"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          className={css.filters}
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className={css.filters}
        >
          <option value="">All actions</option>
          <option value="call">call</option>
          <option value="delegate_call">delegate_call</option>
        </select>
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
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App
