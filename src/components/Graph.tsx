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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function Graph({ nodes, edges, highlightNodeId }: Props) {
  const graphRef = useRef<ForceGraphMethods>(undefined);

  useEffect(() => {
    if (!graphRef.current) return;

    graphRef.current.d3Force("link")?.distance(400);
  }, []);
  return (
    <div>
      <ForceGraph2D
        width={800}
        height={500}
        ref={graphRef}
        linkColor={() => "rgba(193, 216, 240, 0.6)"}
        graphData={{ nodes, links: edges }}
        nodeLabel={(node: any) => node.label || node.id}
        linkLabel={(link: any) => link.label}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label || node.id;
          const fontSize = 10 / globalScale;
          const paddingX = 8;
          const paddingY = 6;

          ctx.font = `${fontSize}px 'Inter', sans-serif`;
          const textMetrics = ctx.measureText(label);
          const textWidth = textMetrics.width;
          const textHeight = fontSize;

          const width = textWidth + paddingX * 2;
          const height = textHeight + paddingY * 2;

          const x = node.x! - width / 2;
          const y = node.y! - height / 2;

          // Node background
          ctx.beginPath();
          const radius = 6;
          roundRect(ctx, x, y, width, height, radius);

          ctx.fillStyle = "#b91c1c"; // светло-голубой с прозрачностью
          ctx.fill();

          // Border (optional)
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#b91c1c";
          ctx.stroke();

          // Text
          ctx.fillStyle = "#f3f4f6";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x!, node.y!);
        }}
        linkDirectionalArrowLength={12}
        linkDirectionalArrowRelPos={0.98}
      />
    </div>
  );
}
