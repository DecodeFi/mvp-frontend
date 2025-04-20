export function buildGraphFromData(data) {
  if (!data) return { nodes: [], edges: [] }

  const nodesMap = new Map()
  const positionsMap = new Map()
  const edges = []

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
    if (!nodesMap.has(from)) {
      const yFrom = yOffsetFrom * yStep
      positionsMap.set(from, { x: 30, y: yFrom })
      nodesMap.set(from, {
        id: from,
        type: "nodeHeaderNode",
        data: { label: from },
        dragHandle: ".drag-handle",
        position: positionsMap.get(from),
      })
      yOffsetFrom += 1
    }

    // Assign to node
    if (!nodesMap.has(to)) {
      const yTo = yOffsetTo * yStep
      positionsMap.set(to, { x: 400, y: yTo })
      nodesMap.set(to, {
        id: to,
        type: "nodeHeaderNode",
        data: { label: to },
        dragHandle: ".drag-handle",
        position: positionsMap.get(to),
      })
      yOffsetTo += 1
    }

    // Assign storage node if needed
    if (action === "delegate_call" && !nodesMap.has(storage)) {
      const yStorage = (yOffsetTo + 1) * yStep
      positionsMap.set(storage, { x: 250, y: yStorage })
      nodesMap.set(storage, {
        id: storage,
        type: "nodeHeaderNode",
        data: { label: storage },
        dragHandle: ".drag-handle",
        position: positionsMap.get(storage),
      })
      yOffsetTo += 1
    }

    // Edge: from -> to
    edges.push({
      id: `${from}-${to}-${hash}`,
      source: from,
      target: to,
      label: `${action} (${hash?.slice(0, 8)}…)`,
    })

    // Edge: storage -> to if delegate_call
    if (action === "delegate_call") {
      edges.push({
        id: `${storage}-${to}-${hash}`,
        source: storage,
        target: to,
        label: `delegate_ref (${hash?.slice(0, 8)}…)`,
      })
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  }
}
