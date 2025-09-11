import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = '0xYourContractAddressHere';
const CONTRACT_ABI = [
  // minimal example ABI - replace with your real ABI
  "function storeImage(string memory b64) public",
];

function App() {
  const [fileB64, setFileB64] = useState('');
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.onload = () => resolve(reader.result.split(',')[1]); // remove "data:*/*;base64,"
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(e) {
    setStatus('');
    const file = e.target.files?.[0];
    if (!file) return;
    // simple size guard (example: 100 KB)
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
  }

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
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // ethers v6: use BrowserProvider instead of ethers.providers.Web3Provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Depending on your contract function, you may need to prefix with "data:image/png;base64," on-chain.
      // Here we pass the raw base64 string.
      const tx = await contract.storeImage(fileB64); // adjust function name/args to match your contract
      setStatus('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setStatus('Transaction confirmed: ' + tx.hash);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.message || err));
    }
  }

  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>Upload image → Base64 → Contract</h2>

      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && (
        <div style={{ marginTop: 12 }}>
          <img src={preview} alt="preview" style={{ maxWidth: 240, maxHeight: 240, display: 'block' }} />
          <div>Base64 length: {fileB64.length} chars</div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={callContractWithBase64} disabled={!fileB64}>Send to contract</button>
      </div>

      {status && <div style={{ marginTop: 12, color: 'darkred' }}>{status}</div>}
    </div>
  );
}

export default App;