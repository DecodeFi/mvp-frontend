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

function buildGraphFromData(data) {
  if (!data) return { nodes: [], edges: [] };

  const nodesMap = new Map();
  const positionsMap = new Map();
  const edges = [];

  let yOffsetFrom = 0;
  let yOffsetTo = 0;
  const yStep = 160;

  for (const tx of data) {
    const { from, to, storage, action, hash } = tx;

    // Assign from node
    if (!nodesMap.has(from)) {
      const yFrom = yOffsetFrom * yStep;
      positionsMap.set(from, { x: 30, y: yFrom });
      nodesMap.set(from, {
        id: from,
        type: "nodeHeaderNode",
        data: { label: from },
        dragHandle: ".drag-handle",
        position: positionsMap.get(from),
      });
      yOffsetFrom += 1;
    }

    // Assign to node
    if (!nodesMap.has(to)) {
      const yTo = yOffsetTo * yStep;
      positionsMap.set(to, { x: 400, y: yTo });
      nodesMap.set(to, {
        id: to,
        type: "nodeHeaderNode",
        data: { label: to },
        dragHandle: ".drag-handle",
        position: positionsMap.get(to),
      });
      yOffsetTo += 1;
    }

    // Assign storage node if needed
    if (action === "delegate_call" && !nodesMap.has(storage)) {
      const yStorage = (yOffsetTo + 1) * yStep;
      positionsMap.set(storage, { x: 250, y: yStorage });
      nodesMap.set(storage, {
        id: storage,
        type: "nodeHeaderNode",
        data: { label: storage },
        dragHandle: ".drag-handle",
        position: positionsMap.get(storage),
      });
      yOffsetTo += 1;
    }

    // Edge: from -> to
    edges.push({
      id: `${from}-${to}-${hash}`,
      source: from,
      target: to,
      label: `${action} (${hash.slice(0, 8)}…)`,
    });

    // Edge: storage -> to if delegate_call
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
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
    to: "dadsda",
    storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    value: "0x3e5500",
    action: "call",
  },
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
    to: "dadaaaaaasda",
    storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    value: "0x3e5500",
    action: "call",
  },
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "dadaaaaaasda",
    to: "ффффффф",
    storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    value: "0x3e5500",
    action: "call",
  },
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "уууу",
    to: "фффффуккфф",
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
