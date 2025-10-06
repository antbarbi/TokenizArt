import React from 'react';

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
  },
  {
    "inputs": [],
    "name": "healthCheck",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "pure",
    "type": "function"
  }
];

export default CONTRACT_ABI;
