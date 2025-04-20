import React, { memo } from "react"
import { Handle, NodeProps, Position } from "@xyflow/react"
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Rocket } from "lucide-react"
import {
  NodeHeader,
  NodeHeaderActions,
  NodeHeaderDeleteAction,
  NodeHeaderIcon,
  NodeHeaderMenuAction,
  NodeHeaderTitle,
} from "@/components/graph-nodes/NodeHeader"
import { BaseNode } from "@/components/graph-nodes/BaseNode"
import { CopyButton } from "@/components/ui/CopyButton"
import { truncateAddress } from "@/helpers/truncateAddress"

const NodeHeaderComponent = memo(({ data, selected }: NodeProps) => {
  return (
    <BaseNode selected={selected} className="px-3 py-2">
      <Handle type="target" position={Position.Top} />
      <NodeHeader style={{ cursor: "grab" }} className="drag-handle -mx-3 -mt-2 border-b">
        <NodeHeaderIcon>
          <Rocket />
        </NodeHeaderIcon>
        <NodeHeaderTitle>{truncateAddress(data.label as string, 6)}</NodeHeaderTitle>

        <NodeHeaderDeleteAction />
      </NodeHeader>
      <div className={"flex mt-2 justify-start gap-3 items-center "}>
        <div>{truncateAddress(data.label as string, 6)}</div>
        <CopyButton text={data.label as string} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  )
})

export default NodeHeaderComponent
