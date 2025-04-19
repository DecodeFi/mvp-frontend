import React, { useCallback, useMemo, useState } from "react";
import css from "./App.module.css";
import { Header } from "./components/Header";
import "@xyflow/react/dist/style.css";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ReactFlow,
} from "@xyflow/react";
import NodeHeaderComponent from "@/components/graph-nodes/NodeHeaderComponent";
import { SearchBar } from "@/components/SearchBar";

function detectSearchType(value) {
  if (!value) return null;
  if (value.startsWith("0x") && value.length === 66) return "tx";
  if (value.startsWith("0x") && value.length === 42) return "address";
  if (/^\d+$/.test(value)) return "block";
  return null;
}

const nodeTypes = {
  nodeHeaderNode: NodeHeaderComponent,
};
const defaultNodes = [
  {
    id: "1",
    type: "nodeHeaderNode",
    position: { x: 200, y: 200 },
    data: {},
  },
];

function buildGraphFromData(data) {
  if (!data) return { nodes: [], edges: [] };

  const nodesMap = new Map();
  const edges = [];

  for (const tx of data) {
    const { from, to, storage, action, hash } = tx;
    [from, to, storage].forEach((addr) => {
      if (!nodesMap.has(addr))
        nodesMap.set(addr, {
          id: addr,
          type: "nodeHeaderNode",
          data: { label: addr },
          dragHandle: ".drag-handle",
          position: { x: Math.random() * 400, y: Math.random() * 400 },
        });
    });

    edges.push({
      id: `${from}-${to}-${hash}`,
      source: from,
      target: to,
      label: `${action} (${hash.slice(0, 8)}…)`,
    });

    if (action === "delegate_call") {
      edges.push({
        id: `${storage}-${to}-${hash}`,
        source: storage,
        target: to,
        label: `delegate_ref (${hash.slice(0, 8)}…)`,
      });
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}

const sampleData = [
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    value: "0x3e5500",
    action: "call",
  },
];

function App() {
  const { nodes, edges } = buildGraphFromData(sampleData);
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const searchType = detectSearchType(searchValue);

  const filteredData = sampleData.filter((tx) => {
    return (
      (!fromFilter || tx.from.includes(fromFilter)) &&
      (!toFilter || tx.to.includes(toFilter)) &&
      (!actionFilter || tx.action === actionFilter)
    );
  });
  const [nodes_, setNodes] = useState(nodes);
  const [edges_, setEdges] = useState(edges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  return (
    <div className={css.container}>
      <Header />
      <SearchBar
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSubmit={() => setSearchValue(searchInput)}
      />
      <div className={css.graphContainer} style={{ height: 600 }}>
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
  );
}

export default App;
