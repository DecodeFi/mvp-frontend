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

  const edges = snapshotData.traces.map((trace, idx) => {
    const { from_addr, to_addr, count } = trace
    const color = "#FF0071"
    return {
      id: `${from_addr}`,
      source: from_addr,
      sourceHandle: "source",
      targetHandle: "target",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
        color,
        width: 20,
        height: 20,
      },
      style: {
        stroke: color,
      },
      target: to_addr,
      label: `${count}`,
    }
  })

  return { nodes, edges }
}
