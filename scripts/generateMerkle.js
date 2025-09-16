// node scripts/generateMerkle.js
const { MerkleTree } = require('merkletreejs');
const { ethers } = require('ethers');            //  import ethers
const keccak256 = require('keccak256');
const fs = require('fs');
const path = require('path');

const airdrop = [
  { address: '0x601357454659eB35059aB3A20385560CC9a457D2', amount: '3000000000000000000' },
  { address: '0x6ca483C3ed094B88c0FF79E25f055d92c65b80af', amount: '2000000000000000000' },
  { address: '0x61C2897ceF370fba33D8aA7270861f949D7fA5dc', amount: '3000000000000000000' },
  { address: '0xc81a72201709f24d52bcdE70625b058a8370BfE8', amount: '4000000000000000000' },
];

// Create leaves exactly like Solidity's keccak256(abi.encodePacked(address, amount))
const { solidityPackedKeccak256 } = require("ethers");
const leaves = airdrop.map(x =>
  solidityPackedKeccak256(["address", "uint256"], [x.address, x.amount])
);

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();
console.log("Merkle Root:", root);

const proofs = airdrop.map((x, i) => ({
  address: x.address,
  amount: x.amount,
  proof: tree.getHexProof(leaves[i]),
}));

fs.writeFileSync(
  path.join(__dirname, 'merkle-data.json'),
  JSON.stringify({ root, proofs }, null, 2)
);
console.log('Saved merkle-data.json with proofs.');
