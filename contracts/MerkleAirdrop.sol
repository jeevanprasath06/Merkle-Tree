// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    IERC20 public immutable token;
    bytes32 public  merkleRoot;
    mapping(address => bool) public claimed;
    address public owner;

    event Claimed(address indexed who, uint256 amount);


    constructor(bytes32 _merkleRoot, address _token,address _owner) {
        merkleRoot = _merkleRoot;
        token = IERC20(_token);
        owner=_owner;
    }

    modifier onlyOwner() {
        require(msg.sender==owner,"Not Owner");
        _;
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Already claimed");

        // leaf = keccak256(abi.encodePacked(account, amount))
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Transfer failed");

        emit Claimed(msg.sender, amount);
    }

    function updateMerkleRoot(bytes32 newMerkleRoot) external onlyOwner{
        merkleRoot=newMerkleRoot;
    }
}
