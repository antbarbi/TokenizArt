import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { checkContractHealth } from '../api/contractApi.js';

export const useContract = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [status, setStatus] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('contractAddress');
    if (saved) {
      setContractAddress(saved);
      setInputAddress(saved);
    }
  }, []);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('handleAddressSubmit called with:', inputAddress);
    if (!inputAddress || !ethers.isAddress(inputAddress)) {
      setStatus('Invalid Ethereum address');
      setLoading(false);
      return;
    }
    try {
      const isHealthy = await checkContractHealth(inputAddress);
      console.log('isHealthy:', isHealthy);
      if (isHealthy) {
        setContractAddress(inputAddress);
        localStorage.setItem('contractAddress', inputAddress);
        setStatus('');
      } else {
        setStatus('Contract does not respond to healthCheck');
      }
    } catch (err) {
      console.log('Error:', err);
      setStatus('Contract not found or invalid: ' + err.message);
    }
    setLoading(false);
  };

  const clearStorage = () => {
    localStorage.removeItem('contractAddress');
    setContractAddress('');
  };

  return {
    contractAddress,
    status,
    inputAddress,
    setInputAddress,
    handleAddressSubmit,
    clearStorage,
    loading
  };
};
