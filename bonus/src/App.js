import React from 'react';
import ContractForm from './components/ContractForm';
import ImageUploader from './components/ImageUploader';
import { useContract } from './hooks/useContract';
import { useFile } from './hooks/useFile';
import { useMint } from './hooks/useMint';
import './App.css';

function App() {
  const contractHook = useContract();
  const fileHook = useFile();
  const mintHook = useMint(contractHook.contractAddress);

  if (!contractHook.contractAddress) {
    return <ContractForm {...contractHook} />;
  }

  return (
    <div className="App p-5">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <h2 className='font-bold'>Connected to contract: {contractHook.contractAddress}</h2>
        <button onClick={contractHook.clearStorage} className="logout-btn">Swap contract</button>
      </div>
      <div className='pt-[20vh]'/>
      <ImageUploader {...fileHook} />
      <div style={{ marginTop: 12 }}>
        <button onClick={() => mintHook.callContractWithBase64(fileHook.fileB64)} disabled={!fileHook.fileB64} className="send-btn">Send to contract</button>
      </div>
      {mintHook.status && <div style={{ marginTop: 12, color: 'darkred' }}>{mintHook.status}</div>}
    </div>
  );
}

export default App;