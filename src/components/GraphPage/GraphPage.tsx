import React, { useCallback, useEffect, useMemo, useState } from "react"
import css from "./GraphPage.module.css"
import "@xyflow/react/dist/style.css"
import { applyEdgeChanges, applyNodeChanges, Background, ReactFlow } from "@xyflow/react"
import { skipToken } from "@reduxjs/toolkit/query"
import { buildGraphFromData } from "@/helpers/buildGraphFromData"
import { FilterAddress } from "@/components/graph-filters/FilterAddress"
import { IBlockData } from "@/types/IBlockData"
import NodeHeaderComponent from "@/components/graph-nodes/NodeHeaderComponent"
import { ContractTableComponent, SearchBar } from "@/components"
import { Button } from "@/components/ui/button"
import { buildGraphFromSnapshot } from "@/helpers/buildGraphFromSnapshot"
import { detectSearchType } from "@/helpers/detectSearchType"
import {
  useGetAddressQuery,
  useGetLatestBlockNumberQuery,
  useGetSnapshotQuery,
  useGetTxsQuery,
} from "../../../backend/apiSlice"
import { Header } from "@/components/Header/Header"

const nodeTypes = {
  nodeHeaderNode: NodeHeaderComponent,
}

export function GraphPage() {
  const [fromFilter, setFromFilter] = useState<string[]>([])
  const [toFilter, setToFilter] = useState<string[]>([])
  const [actionFilter, setActionFilter] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [searchValue, setSearchValue] = useState("0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b")
  const [viewAddress, setViewAddress] = useState<string>("")
  const [cachedData, setCachedData] = useState<IBlockData[][]>([])
  const [snapShotName, setSnapShotName] = useState<string>("")
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
    searchType === "address" ? searchValue?.toLowerCase() : skipToken
  )

  const { data: snapshotData } = useGetSnapshotQuery(
    searchType === "snapshot" ? searchValue?.toLowerCase() : skipToken
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
          ? addressDataRaw?.traces
          : []

  useEffect(() => {
    if (rawData?.length) {
      setCachedData((prev) => [...prev, rawData])
    }
  }, [rawData])

  const filteredData: IBlockData[] = cachedData
    ?.flatMap((item) => item)
    .filter((tx) => {
      return (
        (!fromFilter.length || fromFilter.includes(tx.from_addr)) &&
        (!toFilter.length || toFilter.includes(tx.to_addr)) &&
        (!actionFilter || tx.action === actionFilter)
      )
    })
  const filteredGraphData = useMemo(() => {
    return filteredData?.length
      ? [buildGraphFromData(filteredData, searchValue, setViewAddress, 0)]
      : []
  }, [filteredData])
  const { nodes, edges } = useMemo(() => {
    const allNodes = filteredGraphData?.flatMap(({ nodes }) => nodes)

    const allEdges = filteredGraphData?.flatMap(({ edges }) => edges)

    return { nodes: allNodes, edges: allEdges }
  }, [filteredGraphData, fromFilter, toFilter, actionFilter])

  useEffect(() => {
    if (blockData || addressDataRaw) {
      setNodes(nodes)
      setEdges(edges)
    }
  }, [blockData, txDataRaw, addressDataRaw, cachedData, fromFilter, toFilter, actionFilter])
  useEffect(() => {
    if (searchType === "snapshot" && snapshotData) {
      const { nodes, edges } = buildGraphFromSnapshot(snapshotData, setViewAddress, 0)
      setNodes(nodes)
      setEdges(edges)
    }
  }, [snapshotData, searchType])
  const [nodes_, setNodes] = useState(nodes)
  const [edges_, setEdges] = useState(edges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [blockData, txDataRaw, filteredData, cachedData, addressDataRaw]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [blockData, txDataRaw, filteredData, cachedData, addressDataRaw]
  )
  const sendSnapshot = useCallback(
    async (snapshotName: string, nodes_: any[]) => {
      const snapshot_nodes = nodes_
        .filter((n) => n.id && n.position)
        .map((node) => ({
          x: node.position.x,
          y: node.position.y,
          address: node.id,
        }))

      const body = {
        snapshot_name: snapshotName,
        snapshot_nodes,
      }
      try {
        const res = await fetch("https://45.144.31.133:3443/api/addresses/snapshot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })

        if (!res.ok) throw new Error("Snapshot failed")
        console.log("✅ Snapshot sent", res)
      } catch (err) {
        console.error("❌ Snapshot error:", err)
      }
    },
    [nodes_]
  )

  return (
    <div className={css.container}>
      <Header />
      <div className="flex justify-center">
        <SearchBar
          value={searchInput}
          className="w-2/5"
          clearValue={() => setSearchInput("")}
          onChange={(e) => setSearchInput(e.target.value)}
          onSubmit={() => {
            setSearchValue(searchInput)
            setViewAddress(searchInput)
          }}
        />
      </div>
      {(isLoadingBLockData || isLoadingAddressDataRaw || isLoadingTxDataRaw) && (
        <div>loading...</div>
      )}
      <div className="flex flex-col gap-2">
        <input
          value={snapShotName}
          placeholder="insert the snapshot name"
          style={{
            width: "30%",
            margin: "auto",
            backgroundColor: "#f5f5f5",
            padding: "0.5rem",
            borderRadius: "5px",
          }}
          onChange={(e) => {
            setSnapShotName(e.target.value)
          }}
        />
        <p className="text-center">
          Set the graph nodes the way you want. <br />
          Then insert the name of your snapshot and click "send snapshot". <br /> You will be
          able to get that snapshot in the search bar afterwards
        </p>
      </div>
      <Button
        style={{ width: "8rem", margin: "auto" }}
        onClick={() => sendSnapshot(snapShotName, nodes_)}
      >
        send snapshot
      </Button>

      <div className="flex items-center justify-center gap-6 flex-col sm:flex-row">
        <FilterAddress
          addresses={cachedData?.flatMap((item) => item).map(({ from_addr }) => from_addr)}
          onSelect={setFromFilter}
          type="from"
        />
        <FilterAddress
          addresses={cachedData?.flatMap((item) => item).map(({ to_addr }) => to_addr)}
          onSelect={setToFilter}
          type="to"
        />

        <Button
          variant="outline"
          onClick={() => {
            setCachedData([])
            setNodes([])
            setEdges([])
            setSearchValue("")
            setSearchInput("")
            setViewAddress("")
          }}
        >
          Clear Graph
        </Button>
      </div>
      <div className="w-full flex justify-center">
        <div className={css.graphContainer}>
          <style>{`.react-flow__attribution { display: none !important; }`}</style>
          <style>{`.react-flow__node {user-select: text !important;}`}</style>
          <style>{`.react-flow__node.draggable {cursor: default !important;}`}</style>
          <ReactFlow
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            nodes={nodes_}
            minZoom={0.1}
            edges={edges_}
            nodeTypes={nodeTypes}
            onInit={(instance) => instance.setViewport({ x: 300, y: 0, zoom: 0.5 })}
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
      {viewAddress && (
        <div className={css.contractTable}>
          <ContractTableComponent address={viewAddress} setIsOpenTable={setViewAddress} />
        </div>
      )}
    </div>
  )
}
