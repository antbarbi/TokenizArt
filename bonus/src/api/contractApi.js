import { ethers } from 'ethers';
import CONTRACT_ABI from './contractAbi.js';

export const checkContractHealth = async (address) => {
  const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');
  const code = await provider.getCode(address);
  if (code === '0x') {
    throw new Error('Address is not a deployed contract');
  }
  const contract = new ethers.Contract(address, CONTRACT_ABI, provider);
  return await contract.healthCheck();
};

export const mintNFT = async (contractAddress, signer, to, name, description, image, artist = "") => {
  const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
  const tx = await contract.mintNFT(to, name, description, image, artist);
  await tx.wait();
  return tx.hash;
};
