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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ERR_SCORE_THRESH = 0
const LOW_SCORE_THRESH = 2000
const MEDIUM_SCORE_THRESH = 5000

function getSecurityLevelEmoji(score?: number): string {
  if (score === undefined || score === null || score < ERR_SCORE_THRESH) return "⚫" // unknown = high risk
  if (score < LOW_SCORE_THRESH) return "🟢" // good
  if (score < MEDIUM_SCORE_THRESH) return "🟡" // medium
  return "🔴" // bad
}

function getScoreMessage(score?: number): string {
  if (score === undefined) {
    return "No security check was done for this contract."
  } else if (score < ERR_SCORE_THRESH) {
    return "Security check failed for this contract."
  }

  return `Contract's security score is ${score}.`
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
    case securityCheckInfo?.score >= ERR_SCORE_THRESH && securityCheckInfo?.score < LOW_SCORE_THRESH:
      securityStatus = "The contract is safe"
      break
    case (securityCheckInfo?.score >= LOW_SCORE_THRESH && securityCheckInfo?.score < MEDIUM_SCORE_THRESH) || 
      securityCheckInfo?.score < ERR_SCORE_THRESH || !securityCheckInfo?.score:
      securityStatus = "Be careful"
      break
    case securityCheckInfo?.score >= MEDIUM_SCORE_THRESH:
      securityStatus = "The contract might be dangerous"
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
      <Handle type="target" id="target" position={Position.Left} />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
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
                  {getScoreMessage(securityCheckInfo?.score)} {securityStatus}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
      <Handle type="source" id="source" position={Position.Right} />
    </BaseNode>
  )
})

export default NodeHeaderComponent
