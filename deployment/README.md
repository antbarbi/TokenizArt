# Deployment Guide — Ethereum (Remix)

This guide explains how to compile, deploy and test the `42nug` ERC‑721 NFT contract using Remix and MetaMask on Ethereum testnets (Sepolia / Goerli) or Mainnet.

## Prerequisites

- MetaMask installed in your browser and a funded testnet account (Sepolia or Goerli).
- Remix IDE: https://remix.ethereum.org/
- Optional: IPFS account or nft.storage / Pinata for hosting metadata and images.

## Quick Steps (Remix + MetaMask)

1. Open Remix: https://remix.ethereum.org/ and create a new Solidity file (e.g., `NugNFT.sol`).
2. Paste or import your ERC‑721 contract.
3. Click **Compile**.
4. In Remix `Deploy & Run Transactions` panel select `Injected Web3` (this connects to MetaMask).
5. Switch MetaMask to the target network (Sepolia or Goerli) and ensure you have test ETH from a faucet.
6. Deploy the contract via Remix and confirm the transaction in MetaMask.
7. Test the code through the deployed contract.

## Recommended Workflow for Metadata

1. Put the NFT image and JSON metadata on IPFS (use `nft.storage`, `Pinata` or a public gateway).
2. The JSON should include `name`, `description`, `image` (ipfs:// or https URL) and optional `attributes`.
3. Pass the IPFS URL as the `tokenURI` when minting.

Example metadata:
```json
{
  "name": "42nug #1",
  "description": "A nug of 42",
  "image": "ipfs://<CID>/image.png",
  "attributes": []
}
```

## Useful Links

- Remix: https://remix.ethereum.org/
- MetaMask: https://metamask.io/
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts/
- nft.storage: https://nft.storage/
- IPFS: https://ipfs.io/
- Etherscan: https://etherscan.io/

## Ressources

 - [NFT metadata](bafkreich7tg7nywdor7iyrs4gsgvsfx6vpfidwduqzfiwrr6ktldozlzcy)
 - [tiny nug2](https://violet-peaceful-worm-927.mypinata.cloud/ipfs/bafkreicyvboy2rmy24x56bf7gvlnda4royiqw42mirgi25bbjbwokms4qe)
 - [tiny nug1](https://violet-peaceful-worm-927.mypinata.cloud/ipfs/bafkreifg3p463d3yax4lmffkhkomp2wjq4fxqq62wfsmpmef55tzhohy5e)
 - [nug2](https://violet-peaceful-worm-927.mypinata.cloud/ipfs/bafybeic4hvotlbvt5jveb6cgivrfhxxkamahqii3hy5fli5bl6kwy4hjv4)
 - [nug1](https://violet-peaceful-worm-927.mypinata.cloud/ipfs/bafybeihhrt5yqzjaw2sun7laq2lgmkmmafmsvkgt6qevxmpeioesp6252a)