import { useState } from 'react';
import { ethers } from 'ethers';
import { mintNFT } from '../api/contractApi.js';

export const useMint = (contractAddress) => {
  const [status, setStatus] = useState('');

  const callContractWithBase64 = async (fileB64) => {
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
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        try {
          await provider.send('wallet_switchEthereumChain', [{ chainId: '0xaa36a7' }]);
        } catch (switchError) {
          if (switchError.code === 4902) {
            await provider.send('wallet_addEthereumChain', [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]);
          } else {
            throw switchError;
          }
        }
      }
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setStatus('Transaction sent, waiting for confirmation...');
      const txHash = await mintNFT(contractAddress, signer, address, "My NFT", "Uploaded image", fileB64);
      setStatus('Transaction confirmed: ' + txHash);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.message || err));
    }
  };

  return { status, callContractWithBase64 };
};
