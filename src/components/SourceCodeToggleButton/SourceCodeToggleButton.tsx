import { Button } from "@/components/ui/button"

export const SourceCodeToggleButton = ({
  hasSourceCode,
  onToggle,
  isToggled,
}: {
  hasSourceCode: boolean
  onToggle: () => void
  isToggled: boolean
}) => {
  if (!hasSourceCode)
    return (
      <p className="border border-dashed border-red-500 text-red-500 rounded-md px-2 py-1 text-xs w-fit">
        Source code unavailable
      </p>
    )

  return (
    <Button
      onClick={onToggle}
      style={{ color: "#FF0071", border: "1px dashed #FF0071" }}
      className="border border-dashed  rounded-md px-2 py-1 text-xs"
      variant="outline"
    >
      {isToggled ? "Hide Source Code" : "View Source Code"}
    </Button>
  )
}
