import { handleEdges } from "./handleEdges"

export function buildGraphFromSnapshot(snapshotData, setChosenAddress, xOffset = 0) {
  if (!snapshotData || !snapshotData.nodes?.length || !snapshotData.traces?.length) {
    return { nodes: [], edges: [] }
  }

  const nodes = snapshotData.nodes.map((node, idx) => ({
    id: node.address,
    type: "nodeHeaderNode",
    data: {
      label: node.address,
      setChosenAddress,
    },
    dragHandle: ".drag-handle",
    position: {
      x: node.x + xOffset,
      y: node.y,
    },
  }))

  
  
  let edges = handleEdges(snapshotData.traces)

  return { nodes, edges }
}
