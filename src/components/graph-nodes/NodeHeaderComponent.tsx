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

function getSecurityLevelEmoji(score?: number): string {
  if (score === undefined || score === null) return "🔴" // unknown = high risk
  if (score <= 3000) return "🟢" // good
  if (score <= 7000) return "🟡" // medium
  return "🔴" // bad
}

const NodeHeaderComponent = memo(({ data, selected }: NodeProps) => {
  const id = useNodeId()
  const { data: addressData } = useGetAddressInfoQuery(id)
  const { data: securityCheckInfo } = useGetSecurityCheckQuery(id)
  const { label, setChosenAddress } = data as {
    label: string
    setChosenAddress: (address: string) => void
  }
  let securityStatus
  switch (true) {
    case securityCheckInfo?.score > 0 && securityCheckInfo?.score < 3500:
      securityStatus = "The contract is safe"
      break
    case securityCheckInfo?.score > 3500 && securityCheckInfo?.score < 6500:
      securityStatus = "The contract might be dangerous"
      break
    case securityCheckInfo?.score > 6500 || !securityCheckInfo?.score:
      securityStatus = "Be careful"
      break
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
                <span>{getSecurityLevelEmoji(securityCheckInfo?.score)}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Contract's score is {securityCheckInfo?.score || "undefined"}.{" "}
                  {securityStatus}
                </p>
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
