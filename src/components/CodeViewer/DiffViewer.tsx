import ReactDiffViewer from "react-diff-viewer-continued"

interface ContractDiffViewerProps {
  oldSource: string
  newSource: string
}

export function ContractDiffViewer({ oldSource, newSource }: ContractDiffViewerProps) {
  return (
    <ReactDiffViewer
      oldValue={oldSource}
      newValue={newSource}
      splitView={true}
      hideLineNumbers={false}
      showDiffOnly={false}
      useDarkTheme={false}
    />
  )
}
