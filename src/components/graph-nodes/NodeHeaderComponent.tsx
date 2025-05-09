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
import { useGetAddressInfoQuery, useGetSecurityCheckQuery } from "../../../backend/apiSlice"
import tetherIcon from "@/assets/tetherIcon.svg"
import uniswapIcon from "@/assets/uniswapIcon.svg"
import wethIcon from "@/assets/wethIcon.svg"
import daiIcon from "@/assets/daiIcon.svg"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShieldEllipsis } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function getSecurityColor(score: number = 0): string {
  // Нормализуем: 0 (лучший) → 1, 10000 (худший) → 0
  const t = Math.max(0, Math.min(1, 1 - score / 10000))

  // Интерполяция между:
  // зелёный (#00ff5f) → бордовый (#7a0026)
  const r = Math.round(0x7a * (1 - t) + 0x00 * t)
  const g = Math.round(0x00 * (1 - t) + 0xff * t)
  const b = Math.round(0x26 * (1 - t) + 0x5f * t)

  return `rgb(${r}, ${g}, ${b})`
}

const NodeHeaderComponent = memo(({ data, selected }: NodeProps) => {
  const id = useNodeId()
  const { data: addressData } = useGetAddressInfoQuery(id)
  const { data: securityCheckInfo } = useGetSecurityCheckQuery(id)
  const { label, setChosenAddress } = data as {
    label: string
    setChosenAddress: (address: string) => void
  }

  let icon = ""
  switch (true) {
    case addressData?.contractName?.toLowerCase()?.includes("uniswap"):
      icon = uniswapIcon
      break
    case addressData?.contractName?.toLowerCase()?.includes("tether"):
      icon = tetherIcon
      break
    case addressData?.contractName?.toLowerCase()?.includes("weth"):
      icon = wethIcon
      break
    case addressData?.contractName?.toLowerCase()?.includes("dai"):
      icon = daiIcon
      break
  }

  const [hovered, setHovered] = useState(false)
  console.log(securityCheckInfo, "securityCheckInfo")
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
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
        <Handle type="target" id="target" position={Position.Left} />
        <NodeHeader style={{ cursor: "grab" }} className="drag-handle -mx-3 -mt-2 border-b">
          <NodeHeaderIcon>
            {icon ? <img width={16} height={16} src={icon} /> : <Rocket />}
          </NodeHeaderIcon>
          <NodeHeaderTitle>
            <div>{addressData?.contractName || "Unknown Contract"}</div>
          </NodeHeaderTitle>
          <NodeHeaderDeleteAction />
        </NodeHeader>
        <div className={"flex mt-2 justify-start gap-3 items-center "}>
          <div>{truncateAddress(label as string, 6)}</div>
          <CopyButton text={label as string} />
          <Button
            onClick={() => setChosenAddress(label)}
            style={{
              borderRadius: "10px",
              padding: "2px 4px",
              color: "black",
              height: "fit-content",
            }}
          >
            View
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldEllipsis color={getSecurityColor(securityCheckInfo?.score)} />
              </TooltipTrigger>
              <TooltipContent>
                <p>The contract is secure {securityCheckInfo?.score}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Handle type="source" id="source" position={Position.Right} />
      </BaseNode>
    </motion.div>
  )
})

export default NodeHeaderComponent
