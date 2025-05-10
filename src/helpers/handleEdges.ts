export function handleEdges(traces) {
    let edgesMap = new Map()
    for (let trace of traces) {
      const {
        from_addr: from,
        to_addr: to,
        storage_addr: storage,
        action,
      } = trace
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

    return Array.from(edgesMap.values())
}