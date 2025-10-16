// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Simple NFT contract with minting, burning, and base URI capabilities
contract SimpleNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    constructor() ERC721("42NugArt", "42NA") Ownable(msg.sender) {}

    function mintNFT(
        address to, 
        string memory title, 
        string memory description, 
        string memory artistName, 
        string memory imageUrl
    ) public onlyOwner {

        require(contains42(artistName), "Artist name must contain '42'");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(to, tokenId);
        
        // Generate metadata JSON
        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                title,
                '","description":"',
                description,
                '","image":"',
                imageUrl,
                '","artist":"',
                artistName,
                '"}'
            )
        );
        
        // Create data URI with base64 encoded JSON
        string memory metadataURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                base64Encode(bytes(json))
            )
        );
        
        _setTokenURI(tokenId, metadataURI);
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized to burn");
        _burn(tokenId);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}