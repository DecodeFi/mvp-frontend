import { forwardRef, useCallback, HTMLAttributes, ReactNode } from "react"
import { useNodeId, useReactFlow } from "@xyflow/react"
import { EllipsisVertical, Trash } from "lucide-react"

import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
import { IBlockData } from "@/types/IBlockData"

/* NODE HEADER -------------------------------------------------------------- */

export type NodeHeaderProps = HTMLAttributes<HTMLElement>

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export const NodeHeader = forwardRef<HTMLElement, NodeHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <header
        ref={ref}
        {...props}
        className={cn(
          "flex items-center justify-between gap-2 px-3 py-2",
          // Remove or modify these classes if you modify the padding in the
          // `<BaseNode />` component.
          className
        )}
      />
    )
  }
)

NodeHeader.displayName = "NodeHeader"

/* NODE HEADER TITLE -------------------------------------------------------- */

export type NodeHeaderTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  asChild?: boolean
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export const NodeHeaderTitle = forwardRef<HTMLHeadingElement, NodeHeaderTitleProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3"

    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(className, "user-select-none flex-1 font-semibold")}
      />
    )
  }
)

NodeHeaderTitle.displayName = "NodeHeaderTitle"

/* NODE HEADER ICON --------------------------------------------------------- */

export type NodeHeaderIconProps = HTMLAttributes<HTMLSpanElement>

export const NodeHeaderIcon = forwardRef<HTMLSpanElement, NodeHeaderIconProps>(
  ({ className, ...props }, ref) => {
    return <span ref={ref} {...props} className={cn(className, "[&>*]:size-5")} />
  }
)

NodeHeaderIcon.displayName = "NodeHeaderIcon"

/* NODE HEADER ACTIONS ------------------------------------------------------ */

export type NodeHeaderActionsProps = HTMLAttributes<HTMLDivElement>

/**
 * A container for right-aligned action buttons in the node header.
 */
export const NodeHeaderActions = forwardRef<HTMLDivElement, NodeHeaderActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("ml-auto flex items-center gap-1 justify-self-end", className)}
      />
    )
  }
)

NodeHeaderActions.displayName = "NodeHeaderActions"

/* NODE HEADER ACTION ------------------------------------------------------- */

export type NodeHeaderActionProps = React.ComponentProps<"button"> & {
  label: string
}

/**
 * A thin wrapper around the `<Button />` component with a fixed sized suitable
 * for icons.
 *
 * Because the `<NodeHeaderAction />` component is intended to render icons, it's
 * important to provide a meaningful and accessible `label` prop that describes
 * the action.
 */
export const NodeHeaderAction = forwardRef<HTMLButtonElement, NodeHeaderActionProps>(
  ({ className, label, title, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        aria-label={label}
        title={title ?? label}
        className={cn(className, "nodrag size-6 p-1")}
        {...props}
      />
    )
  }
)

NodeHeaderAction.displayName = "NodeHeaderAction"

//

export type NodeHeaderMenuActionProps = Omit<NodeHeaderActionProps, "onClick"> & {
  trigger?: ReactNode
}

/**
 * Renders a header action that opens a dropdown menu when clicked. The dropdown
 * trigger is a button with an ellipsis icon. The trigger's content can be changed
 * by using the `trigger` prop.
 *
 * Any children passed to the `<NodeHeaderMenuAction />` component will be rendered
 * inside the dropdown menu. You can read the docs for the shadcn dropdown menu
 * here: https://ui.shadcn.com/docs/components/dropdown-menu
 *
 */
export const NodeHeaderMenuAction = forwardRef<HTMLButtonElement, NodeHeaderMenuActionProps>(
  ({ trigger, children, ...props }, ref) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <NodeHeaderAction ref={ref} {...props}>
            {trigger ?? <EllipsisVertical />}
          </NodeHeaderAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent>{children}</DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

NodeHeaderMenuAction.displayName = "NodeHeaderMenuAction"

/* NODE HEADER DELETE ACTION --------------------------------------- */

export const NodeHeaderDeleteAction = () => {
  const id = useNodeId()
  const { setNodes } = useReactFlow()

  const handleClick = useCallback(() => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))
  }, [id, setNodes])

  return (
    //@ts-ignore
    <NodeHeaderAction
      style={{ backgroundColor: "white" }}
      onClick={handleClick}
      label="Delete node"
    >
      <Trash />
    </NodeHeaderAction>
  )
}

NodeHeaderDeleteAction.displayName = "NodeHeaderDeleteAction"
export const NodeHeaderAddAction = () => {
  const id = useNodeId()
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow()

  const handleClick = useCallback(() => {
    // 👇 допустим rawData передан через window или контекст
    const fullGraph = (window as any).graphData as IBlockData[]

    const outgoing = fullGraph?.filter((tx) => tx.from_addr === id)
    const existingNodes = new Set(getNodes().map((n) => n.id))
    const existingEdges = new Set(getEdges().map((e) => e.id))

    const newNodes = []
    const newEdges = []

    for (const tx of outgoing) {
      if (!existingNodes.has(tx.to_addr)) {
        newNodes.push({
          id: tx.to_addr,
          type: "nodeHeaderNode",
          data: { label: tx.to_addr },
          position: {
            x: Math.random() * 400,
            y: Math.random() * 400,
          },
        })
      }

      const edgeId = `${tx.from_addr}-${tx.to_addr}-${tx.action}`
      if (!existingEdges.has(edgeId)) {
        newEdges.push({
          id: edgeId,
          source: tx.from_addr,
          target: tx.to_addr,
          animated: true,
          markerEnd: {
            type: "arrowclosed",
            color: "#6366f1",
            width: 20,
            height: 20,
          },
          style: { stroke: "#6366f1" },
        })
      }
    }

    setNodes((nodes) => [...nodes, ...newNodes])
    setEdges((edges) => [...edges, ...newEdges])
  }, [id, setNodes, setEdges, getNodes, getEdges])

  return (
    //@ts-ignore
    <NodeHeaderAction
      onClick={handleClick}
      label="Add linked nodes"
      style={{ backgroundColor: "white" }}
    >
      +
    </NodeHeaderAction>
  )
}
