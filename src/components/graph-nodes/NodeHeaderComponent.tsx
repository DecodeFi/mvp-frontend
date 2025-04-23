import React, { memo, useEffect, useState } from "react"
import { Handle, NodeProps, Position, useNodeId } from "@xyflow/react"
import { Rocket } from "lucide-react"
import {
  NodeHeader,
  NodeHeaderAddNodeIn,
  NodeHeaderAddNodeOut,
  NodeHeaderDeleteAction,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "@/components/graph-nodes/NodeHeader"
import { BaseNode } from "@/components/graph-nodes/BaseNode"
import { CopyButton } from "@/components/ui/CopyButton"
import { truncateAddress } from "@/helpers/truncateAddress"
import { useGetAddressInfoQuery } from "../../../backend/apiSlice"
import tetherIcon from "@/assets/tetherIcon.svg"
import uniswapIcon from "@/assets/uniswapIcon.svg"
import wethIcon from "@/assets/wethIcon.svg"
import daiIcon from "@/assets/daiIcon.svg"

const NodeHeaderComponent = memo(({ data, selected }: NodeProps) => {
  const id = useNodeId()
  //0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b
  const { data: addressData } = useGetAddressInfoQuery(id)
  console.log(addressData, "woooow")
  let icon = ""
  switch (true) {
    case addressData?.contract_name?.toLowerCase()?.includes("uniswap"):
      icon = uniswapIcon
      break
    case addressData?.contract_name?.toLowerCase()?.includes("tether"):
      icon = tetherIcon
      break
    case addressData?.contract_name?.toLowerCase()?.includes("weth"):
      icon = wethIcon
      break
    case addressData?.contract_name?.toLowerCase()?.includes("dai"):
      icon = daiIcon
      break
  }
  console.log(icon, "iconnn")
  const [hovered, setHovered] = useState(false)
  return (
    <BaseNode
      selected={selected}
      className="px-3 py-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <>
          <div className="absolute z-10 left-[-24px] top-1/2 -translate-y-1/2">
            <NodeHeaderAddNodeIn />
          </div>
          <div className="absolute z-10 right-[-24px] top-1/2 -translate-y-1/2">
            <NodeHeaderAddNodeOut />
          </div>
        </>
      )}
      <Handle type="target" position={Position.Left} />
      <NodeHeader style={{ cursor: "grab" }} className="drag-handle -mx-3 -mt-2 border-b">
        <NodeHeaderIcon>
          {icon ? <img width={16} height={16} src={icon} /> : <Rocket />}
        </NodeHeaderIcon>
        <NodeHeaderTitle>{addressData?.contract_name}</NodeHeaderTitle>

        <NodeHeaderDeleteAction />
      </NodeHeader>
      <div className={"flex mt-2 justify-start gap-3 items-center "}>
        <div>{truncateAddress(data.label as string, 6)}</div>
        <CopyButton text={data.label as string} />
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  )
})

export default NodeHeaderComponent
