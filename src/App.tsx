import React from 'react';
import ContractDiffViewer from "./components/ContractDiffViewer";


function App() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Contract Diff</h1>
            <ContractDiffViewer  />
        </div>
    );
}

export default App;
