import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;

const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`;

const ContractDiffViewer: React.FC = () => {
    return (
        <div className="p-4">
            <ReactDiffViewer
                oldValue={oldCode}
                newValue={newCode}
                splitView={true}
                showDiffOnly={false} // показать все строки, даже если не изменились
                useDarkTheme={true}
                leftTitle="Old Contract"
                rightTitle="New Contract"
            />
        </div>
    );
};

export default ContractDiffViewer;
