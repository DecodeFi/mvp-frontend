class SimpleQueue {
    elements: Array<string>;
    head: number;
   
    constructor() {
      this.elements = new Array<string>()
      this.head = 0
    }

    push(elem) {
        this.elements.push(elem)
    }

    empty(): boolean {
        return this.elements.length == this.head
    }

    pop(): string {
        let ret = this.elements[this.head]
        this.head += 1

        return ret
    }
  }

export function calcGraphPositions(nodes, edges, initialNode, offset) {

    let xStep = 500
    let yStep = 75


    let graph = new Map<string, Array<any>>()
    for (let e of edges) {
        if (!graph.has(e.source)) {
            graph.set(e.source, [])
        }

        graph.get(e.source).push(
            {
                direction: "to",
                node: e.target
            }
        )

        if (!graph.has(e.target)) {
            graph.set(e.target, [])
        }

        graph.get(e.target).push(
            {
                direction: "from",
                node: e.source
            }
        )
    }

    if (!graph.has(initialNode)) {
        console.log("WARNING:", initialNode, "is not among the edges!", edges)
        return
    }

    let xPos = new Map<string, number>();
    let used = new Map<string, boolean>()
    let q = new SimpleQueue();

    q.push(initialNode)
    xPos.set(initialNode, offset.x)

    let iter = 0
    while (!q.empty()) {
        let cur = q.pop()
        let curPos = xPos.get(cur)

        iter += 1
        if (iter > 1000) {
            console.log("WARNING: too many BFS iterations!")
            break
        }

        if (used.has(cur) && used.get(cur)) {
            continue
        }

        used.set(cur, true)

        for (let n of graph.get(cur)) {
            if (!used.has(n.node)) {
                q.push(n.node)

                if (!xPos.has(n.node)) {
                    xPos.set(n.node, n.direction == "from" ? curPos - xStep : curPos + xStep)
                }
            }
        }
    }

    let yOrder = new Map<number, Array<any>>()
    let positions = new Map<string, any>()
    for (let node of Array.from(xPos.keys())) {
        let x = xPos.get(node)
        if (!yOrder.has(x)) {
            yOrder.set(x, [])
        }
        let yy = yOrder.get(x)
        let position = {
            x,
            y: offset.y + (yy.length + 1) * yStep * ((yy.length % 2 == 0) ? 1 : -1) + ((yy.length % 2 == 0) ? 0 : yStep)
        }
        yy.push(position)
        positions.set(node, position)
    }

    for (let node of nodes) {
        node.position = positions.get(node.id)
    }
}