import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const ContractNameWithProxyTag = ({
  name,
  isProxy,
}: {
  name: string
  isProxy?: boolean
}) => (
  <div className="flex gap-2 items-center">
    <p>{name}</p>
    {isProxy && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="border border-dashed border-pink-500 text-pink-500 rounded-md px-2 py-1 text-xs">
              Proxy
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a proxy contract</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
)
