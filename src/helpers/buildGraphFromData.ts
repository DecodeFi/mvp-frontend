import { truncateAddress } from "@/helpers/truncateAddress"

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
      positionsMap.set(from, { x: -400, y: yFrom + 300 })
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
      positionsMap.set(to, { x: 500, y: yTo })
      nodesMap.set(to, {
        id: to,
        type: "nodeHeaderNode",
        data: { label: to },
        dragHandle: ".drag-handle",
        position: positionsMap.get(to),
      })
      yOffsetTo += 1
    }

    // // Assign storage node if needed
    // if (action === "delegate_call" && !nodesMap.has(storage)) {
    //   const yStorage = (yOffsetTo + 1) * yStep
    //   positionsMap.set(storage, { x: 250, y: yStorage })
    //   nodesMap.set(storage, {
    //     id: storage,
    //     type: "nodeHeaderNode",
    //     data: { label: storage },
    //     dragHandle: ".drag-handle",
    //     position: positionsMap.get(storage),
    //   })
    //   yOffsetTo += 1
    // }
    if (action === "delegate_call") {
      edges.push({
        id: `${from}-${storage}-${to}-${action}`,
        source: storage,
        target: to,
        label: `delegate_call (${truncateAddress(hash, 5)})`,
      })
    }
    // Edge: from -> to
    edges.push({
      id: `${from}-${to}-${action}`,
      source: from,
      animated: true,
      markerEnd: {
        type: "arrowclosed",
        color: "#FF0071",
        width: 20,
        height: 20,
      },
      style: {
        stroke: "#FF0071",
      },
      target: to,
      label: `${action} (${truncateAddress(hash, 5)})`,
    })

    // Edge: storage -> to if delegate_call
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  }
}
