export function concatEdges(oldEdges, newEdges) {
    let dedup = new Map()
    let edges = [...oldEdges, ...newEdges]

    for (let edge of edges) {
        let id = `${edge.source}-${edge.target}-${edge.label}`
        if (edge.source < edge.target) {
            id = `${edge.target}-${edge.source}-${edge.label}`
        }

        if (!dedup.has(id)) {
            dedup.set(id, edge)
        }
    }

    return Array.from(dedup.values())
}

export function concatNodes(oldNodes, newNodes) {
    let dedup = new Map()
    let nodes = [...oldNodes, ...newNodes]
    for (let node of nodes) {
        if (!dedup.has(node.id)) {
            dedup.set(node.id, node)
        }
    }

    return Array.from(dedup.values())
}