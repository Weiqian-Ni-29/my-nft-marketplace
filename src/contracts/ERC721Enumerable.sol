// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC721.sol";
import "./interfaces/IERC721Enumerable.sol";

contract ERC721Enumerable is ERC721, IERC721Enumerable{
    uint256[] private _allTokens;

    // mapping from tokenId to position in _allTokens array
    mapping(uint256 => uint256) private _tokenIndex;
    
    // mapping of owner to list of all owned token ids
    mapping(address => uint256[]) private _ownedTokens;
    
    // mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    constructor(){
        _registerInterface(bytes4(keccak256("totalSupply(bytes4)")^keccak256("tokenByIndex(bytes4)")^keccak256("tokenOfOwnerByIndex(bytes4)")));
    }

    function totalSupply() external view override returns(uint256){
        return _allTokens.length;
    }
    
    // add tokens to the _allTokens array and set the position of the token index
    function _addTokensToAllTokenEnumeration(uint256 tokenId) private {
        _tokenIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function _addTokensToOwner(uint256 tokenId, address owner) private {
        _ownedTokens[owner].push(tokenId);
        _ownedTokensIndex[tokenId] = _ownedTokens[owner].length;
    }

    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);
        
        _addTokensToAllTokenEnumeration(tokenId);
        _addTokensToOwner(tokenId, to);
    }

    // return token id
    function tokenByIndex(uint256 index) public view override returns(uint256) {
        require(index < _allTokens.length && index >= 0, "ERC721: invalid index");
        return _allTokens[index];
    }

    // return token id
    function tokenOfOwnerByIndex(address owner, uint256 index) public view override returns(uint256) {
        require(index < balanceOf(owner) && index >= 0, "ERC721: owner index out of bound");
        return _ownedTokens[owner][index];
    }
}