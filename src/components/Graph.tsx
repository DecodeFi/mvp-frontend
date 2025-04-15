import { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

interface Node {
  id: string;
  label?: string;
  color?: string;
}

interface Edge {
  source: string;
  target: string;
  label?: string;
}

interface Props {
  nodes: Node[];
  edges: Edge[];
  highlightNodeId?: string;
}

export function Graph({ nodes, edges, highlightNodeId }: Props) {
  const graphRef = useRef<ForceGraphMethods>(undefined);

  useEffect(() => {
    if (!graphRef.current) return;

    graphRef.current.d3Force("link")?.distance(200);
  }, []);
  return (
    <div>
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links: edges }}
        nodeLabel={(node: any) => node.label || node.id}
        linkLabel={(link: any) => link.label}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label || node.id;
          const fontSize = 12 / globalScale;
          const paddingX = 8;
          const paddingY = 4;

          ctx.font = `${fontSize}px Sans-Serif`;

          const textMetrics = ctx.measureText(label);
          const textWidth = textMetrics.width;
          const textHeight = fontSize; // приблизительно

          const width = textWidth + paddingX * 2;
          const height = textHeight + paddingY * 2;

          const x = node.x! - width / 2;
          const y = node.y! - height / 2;
          ctx.beginPath();
          // Фон: прямоугольник
          ctx.fillStyle =
            highlightNodeId && node.id === highlightNodeId
              ? "red" // 💛 подсветка
              : node.color || "black";
          ctx.fillRect(x, y, width, height);
          if (highlightNodeId && node.id === highlightNodeId) {
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
          }
          // Текст по центру
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x!, node.y!);
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={0.65}
      />
    </div>
  );
}
