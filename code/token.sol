// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

        string memory metadataURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                base64Encode(bytes(json))
            )
        );
        
        _setTokenURI(tokenId, metadataURI);
    }

    function contains42(string memory text) internal pure returns (bool) {
        bytes memory textBytes = bytes(text);
        if (textBytes.length < 2) return false;
        
        for (uint256 i = 0; i <= textBytes.length - 2; i++) {
            if (textBytes[i] == "4" && textBytes[i + 1] == "2") {
                return true;
            }
        }
        return false;
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

    function base64Encode(
        bytes memory data
    ) internal pure returns (string memory) {
        if (data.length == 0) return "";
        bytes memory table = bytes(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        );
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        uint256 j = 0;
        uint256 len = data.length;
        for (uint256 i = 0; i < len; i += 3) {
            uint256 a = uint8(data[i]);
            uint256 b = i + 1 < len ? uint8(data[i + 1]) : 0;
            uint256 c = i + 2 < len ? uint8(data[i + 2]) : 0;
            uint256 triple = (a << 16) | (b << 8) | c;
            result[j++] = table[(triple >> 18) & 63];
            result[j++] = table[(triple >> 12) & 63];
            result[j++] = table[(triple >> 6) & 63];
            result[j++] = table[triple & 63];
        }
        for (uint256 k = 0; k < (3 - (len % 3)) % 3; k++) {
            result[encodedLen - 1 - k] = bytes1("=");
        }
        return string(result);
    }
}