export function buildGraphFromData(data, id?, setChosenAddress?, offset?) {
  if (!data?.length) return { nodes: [], edges: [] }

  const nodesMap = new Map()
  const positionsMap = new Map()
  const edgesMap = new Map<string, any>()

  let yOffsetFrom = 0
  let yOffsetTo = 0
  const yStep = 160

  for (const tx of data) {
    const {
      from_addr: from,
      to_addr: to,
      storage_addr: storage,
      action,
      tx_hash: hash,
      trace_id,
    } = tx
    
    // Assign from node
    if (from !== "" && !nodesMap.has(from)) {
      const yFrom = id === from ? 100 : yOffsetFrom * yStep
      const xTo = id === from ? 100 : -300
      positionsMap.set(from, { x: xTo, y: yFrom + 300 })
      nodesMap.set(from, {
        id: from,
        type: "nodeHeaderNode",
        data: { label: from, setChosenAddress: setChosenAddress },
        dragHandle: ".drag-handle",
        position: positionsMap.get(from),
      })

      yOffsetFrom += 1
    }

    // Assign from node
    if (storage !== "" && !nodesMap.has(storage)) {
      const yFrom = id === storage ? 100 : yOffsetFrom * yStep
      const xTo = id === storage ? 100 : -300
      positionsMap.set(storage, { x: xTo + offset * 5, y: yFrom + 300 })
      nodesMap.set(storage, {
        id: storage,
        type: "nodeHeaderNode",
        data: { label: storage, setChosenAddress: setChosenAddress },
        dragHandle: ".drag-handle",
        position: positionsMap.get(storage),
      })

      yOffsetFrom += 1
    }

    // Assign to node
    if (to !== "" && !nodesMap.has(to)) {
      const yTo = yOffsetTo * yStep
      positionsMap.set(to, { x: 500 + offset * 5, y: yTo })
      nodesMap.set(to, {
        id: to,
        type: "nodeHeaderNode",
        data: { label: to, setChosenAddress: setChosenAddress },
        dragHandle: ".drag-handle",
        position: positionsMap.get(to),
      })

      yOffsetTo += 1
    }

    let color = "#FF0071"
    let edge_id = `${from}-${to}-${action}`
    let reverse_edge_id = `${to}-${from}-${action}`
    let source = from
    if (action === "delegate_call") {
      edge_id = `${storage}-${to}-${action}`
      reverse_edge_id = `${to}-${storage}-${action}`
      source = storage
      color = "#0079FF"
    } else if (action === "create" || action == "create2") {
      color = "#16C47F"
    }

    if (source == to) {
      continue
    }

    if (edgesMap.has(reverse_edge_id)) {
      // got reverse edge, merge them both
      edgesMap.set(reverse_edge_id, {
        id: reverse_edge_id,
        source: source,
        sourceHandle: "source",
        targetHandle: "target",
        animated: false,
        markerEnd: {
          type: "arrowclosed",
          color: color,
          width: 20,
          height: 20,
        },
        markerStart: {
          type: "arrowclosed",
          color: color,
          width: 20,
          height: 20,
        },
        style: {
          stroke: color,
        },
        target: to,
        label: `${action}`,
      })
    } else {
      // no reverse yet (or at all)
      edgesMap.set(edge_id, {
        id: edge_id,
        source: source,
        sourceHandle: "source",
        targetHandle: "target",
        animated: true,
        markerEnd: {
          type: "arrowclosed",
          color: color,
          width: 20,
          height: 20,
        },
        style: {
          stroke: color,
        },
        target: to,
        label: `${action}`,
      })
    }
  }
  
  let edges = Array.from(edgesMap.values())

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  }
}
