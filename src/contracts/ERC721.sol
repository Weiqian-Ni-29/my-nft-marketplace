// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC165.sol";
import "./interfaces/IERC721.sol";
/*

building the minting function:
    a. nft to point an address
    b. keep track of the token ids
    c. keep track of token owner addresses to token ids
    d. keep track of how many tokens an owener has
    e. create an event that emits a transfer log

*/

contract ERC721 is ERC165, IERC721{

    // mapping from token id to the owner
    mapping(uint256 => address) private _tokenOwner;

    // mapping from owner to the number of owned tokens
    mapping(address => uint256) private _numberOfTokensOwned;

    // mapping from tokenid to approved addresses
    mapping(uint256 => address) private _tokenApprovals;

    constructor(){
        _registerInterface(bytes4(keccak256("balanceOf(bytes4)")^keccak256("ownerOf(bytes4)")^keccak256("transferFrom(bytes4)")));
    }

    function balanceOf(address _owner) public view override returns(uint256) {
        require(_owner != address(0), "ERC721: The address of owner need to be valid");
        return _numberOfTokensOwned[_owner];
    }

    function ownerOf(uint256 _tokenId) public view override returns(address) {
        require(_tokenOwner[_tokenId] != address(0), "ERC721: This token doesn't has an ownership");
        return _tokenOwner[_tokenId];
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        // the mint address is not 0
        require(to != address(0), "ERC721: minting to the zero address");
        // the token hasn't been minted
        require(_tokenOwner[tokenId] == address(0), "ERC721: token has been minted");

        _tokenOwner[tokenId] = to;
        _numberOfTokensOwned[to]++;

        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0), "ERC721: invalid receiving address");
        require(_from == _tokenOwner[_tokenId], "ERC721: the address does not hold this token, this nft cannot be transactted");
        _tokenOwner[_tokenId] = _to;
        _numberOfTokensOwned[_from]--;
        _numberOfTokensOwned[_to]++; 
        emit Transfer(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 tokenId) public {
        require(_to != ownerOf(tokenId), "ERC721: approval to the current owner");
        require(msg.sender == ownerOf(tokenId), "ERC721: Current caller is not the owner");
        _tokenApprovals[tokenId] = _to;
        emit Approval(ownerOf(tokenId), _to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) internal view returns(bool) {
        require(_tokenOwner[tokenId] != address(0), "ERC721: Token not exist");
        address owner = ownerOf(tokenId);
        return (spender == owner);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public override {
        require(isApprovedOrOwner(msg.sender, _tokenId));
        _transferFrom(_from, _to, _tokenId);
    }

}