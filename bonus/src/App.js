import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "name", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "image", "type": "string"}
    ],
    "name": "mintNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [fileB64, setFileB64] = useState('');
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('contractAddress');
    if (saved) setContractAddress(saved);
  }, []);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (inputAddress) {
      setContractAddress(inputAddress);
      localStorage.setItem('contractAddress', inputAddress);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('contractAddress');
    setContractAddress('');
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  }

  const handleFileSelect = async (file) => {
    setStatus('');
    if (!file) return;
    if (file.size > 100 * 1024) {
      setStatus(`File too large (${Math.round(file.size / 1024)} KB). Consider resizing or using IPFS.`);
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      setFileB64(b64);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      setStatus('Failed to read file: ' + err.message);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      setStatus('Please drop an image file.');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  async function callContractWithBase64() {
    setStatus('');
    if (!fileB64) {
      setStatus('No file selected');
      return;
    }
    if (!window.ethereum) {
      setStatus('MetaMask / Ethereum provider not found');
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      const address = await signer.getAddress();
      const tx = await contract.mintNFT(address, "My NFT", "Uploaded image", fileB64);
      setStatus('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setStatus('Transaction confirmed: ' + tx.hash);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.message || err));
    }
  }

  if (!contractAddress) {
    return (
      <div className="App flex flex-col items-center" style={{ paddingTop: '25vh' }}>
        <h2 className="mb-4">Enter Contract Address</h2>
        <form onSubmit={handleAddressSubmit} className="flex flex-col items-center">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="0x..."
            required
            className="mb-4 px-4 py-2 border border-gray-300 rounded"
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App p-5">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <h2 className='font-bold'>Connected to contract: {inputAddress}</h2>
        <button onClick={clearStorage} className="logout-btn">Log out</button>
      </div>
      <div className='pt-[20vh]'/>
      <div className="max-w-md mx-auto">
        <input type="file" accept="image/*" onChange={handleFile} ref={fileInputRef} style={{ display: 'none' }} />

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm">Drag and drop an image here, or click to select</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10KB</p>
          </div>
        </div>
      </div>
      {preview && (
        <div style={{ marginTop: 12 }}>
          <img src={preview} alt="preview" style={{ maxWidth: 240, maxHeight: 240, display: 'block' }} />
          <div>Base64 length: {fileB64.length} chars</div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={callContractWithBase64} disabled={!fileB64} className="send-btn">Send to contract</button>
      </div>

      {status && <div style={{ marginTop: 12, color: 'darkred' }}>{status}</div>}
    </div>
  );
}

export default App;