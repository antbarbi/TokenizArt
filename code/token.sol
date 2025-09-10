// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Simple NFT contract with minting, burning, and base URI capabilities
contract SimpleNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;  // Base URI for metadata, e.g., "https://ipfs.io/ipfs/your-hash/"

    constructor() ERC721("42NugArt", "42NA") Ownable(msg.sender) {}

    // Function to mint new NFTs, restricted to the owner
    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    // Function to burn NFTs, allowed for owner or token holder
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized to burn");
        _burn(tokenId);
    }

    // Function to set base URI for metadata, restricted to owner
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Override _baseURI to return the set base URI
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Override to support tokenURI
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Override to support interface detection
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}