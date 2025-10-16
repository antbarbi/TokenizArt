import React, { useState } from 'react';
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
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [artistName, setArtistName] = useState('');

  // Validation function for artist name
  const isArtistValid = (artist) => {
    return !artist.trim() || artist.includes('42');
  };

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
      
      <div className="max-w-md mx-auto mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NFT Name
          </label>
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="Enter NFT name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            placeholder="Enter NFT description"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artist Name
          </label>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Enter artist name (must contain '42')"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              isArtistValid(artistName) 
                ? 'border-gray-300 focus:ring-blue-500' 
                : 'border-red-500 focus:ring-red-500'
            }`}
          />
          {artistName.trim() && !isArtistValid(artistName) && (
            <p className="mt-1 text-sm text-red-600">
              Artist name must contain "42"
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: 12 }}>
        <button 
          onClick={() => mintHook.callContractWithBase64(fileHook.fileB64, nftName, nftDescription, artistName)} 
          disabled={!fileHook.fileB64 || !nftName.trim() || !isArtistValid(artistName)} 
          className="send-btn"
        >
          Send to contract
        </button>
      </div>
      {mintHook.status && <div style={{ marginTop: 12, color: 'darkred' }}>{mintHook.status}</div>}
    </div>
  );
}

export default App;