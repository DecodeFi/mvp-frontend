import { calcGraphPositions } from "./graphPositions"
import { handleEdges } from "./handleEdges"

export function buildGraphFromData(data, id?, setChosenAddress?, offset?) {
  if (!data?.length) return { nodes: [], edges: [] }

  console.log(data, id, offset)

  const nodesMap = new Map()
  const positionsMap = new Map()

  for (const tx of data) {
    const {
      from_addr: from,
      to_addr: to,
      storage_addr: storage,
    } = tx
    
    // Assign from node
    if (from !== "" && !nodesMap.has(from)) {
      positionsMap.set(from, { x: 0, y: 0 })
      nodesMap.set(from, {
        id: from,
        type: "nodeHeaderNode",
        data: { label: from, setChosenAddress: setChosenAddress },
        dragHandle: ".drag-handle",
        position: positionsMap.get(from),
      })
    }

    // Assign from node
    if (storage !== "" && !nodesMap.has(storage)) {
      positionsMap.set(storage, { x: 0, y: 0 })
      nodesMap.set(storage, {
        id: storage,
        type: "nodeHeaderNode",
        data: { label: storage, setChosenAddress: setChosenAddress },
        dragHandle: ".drag-handle",
        position: positionsMap.get(storage),
      })
    }

    // Assign to node
    if (to !== "" && !nodesMap.has(to)) {
      positionsMap.set(to, { x: 0, y: 0 })
      nodesMap.set(to, {
        id: to,
        type: "nodeHeaderNode",
        data: { label: to, setChosenAddress: setChosenAddress },
        dragHandle: ".drag-handle",
        position: positionsMap.get(to),
      })
    }
  }
  
  let edges = handleEdges(data)
  let nodes = Array.from(nodesMap.values());

  calcGraphPositions(nodes, edges, id, offset)

  return {
    nodes,
    edges,
  }
}
