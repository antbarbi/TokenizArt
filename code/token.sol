// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    struct Metadata {
        string name;
        string description;
        string image;
    }

    mapping(uint256 => Metadata) private _tokenMetadata;

    constructor() ERC721("42NugArt", "42NA") Ownable(msg.sender) {}

    function mintNFT(
        address to,
        string memory name,
        string memory description,
        string memory image
    ) public onlyOwner {
        bytes memory imgBytes = bytes(image);
        require(imgBytes.length > 11, "Image data too short");
        require(
            imgBytes[0] == "d" &&
                imgBytes[1] == "a" &&
                imgBytes[2] == "t" &&
                imgBytes[3] == "a" &&
                imgBytes[4] == ":" &&
                imgBytes[5] == "i" &&
                imgBytes[6] == "m" &&
                imgBytes[7] == "a" &&
                imgBytes[8] == "g" &&
                imgBytes[9] == "e" &&
                imgBytes[10] == "/",
            "Image must be a base64 data URI (start with 'data:image/')"
        );
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(to, tokenId);
        _tokenMetadata[tokenId] = Metadata(name, description, image);
    }

    function mintNFT_IPS(address to, string memory metadataURI) public onlyOwner {
        require(
            startsWith(metadataURI, "ipfs://") || startsWith(metadataURI, "https://"),
            "URI must be IPFS or HTTPS"
        );

        uint256 tokenId = _tokenIdCounter++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }

    // Helper function moved outside
    function startsWith(string memory full, string memory prefix) internal pure returns (bool) {
        bytes memory a = bytes(full);
        bytes memory b = bytes(prefix);
        if (b.length > a.length) return false;
        for (uint256 i = 0; i < b.length; i++) {
            if (a[i] != b[i]) return false;
        }
        return true;
    }

    function burn(uint256 tokenId) public {
        require(
            ownerOf(tokenId) == msg.sender || msg.sender == owner(),
            "Not authorized to burn"
        );
        _burn(tokenId);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function healthCheck() public pure returns (bool) {
        return true;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        Metadata memory meta = _tokenMetadata[tokenId];
        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                meta.name,
                '","description":"',
                meta.description,
                '","image":"',
                meta.image,
                '"}'
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    base64Encode(bytes(json))
                )
            );
    }

    function getImage(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenMetadata[tokenId].image;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
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
        bytes memory result = new bytes(encodedLen + encodedLen / 76); // Add line breaks every 76 chars
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
