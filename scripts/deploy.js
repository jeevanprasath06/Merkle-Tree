// npx hardhat run scripts/deploy.js --network sepolia
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const{PRIVATE_KEY,}=process.env;

async function main() {
  const merkleJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'merkle-data.json')));
  const root = merkleJson.root;

  // Replace with deployed token address (a test ERC20) on Sepolia
  const tokenAddress = "0xaed19707C01b4100e437b4fbE968acf63C200DCD";
  if (!tokenAddress) throw new Error("Set TOKEN_ADDRESS env var");
  const owner= "0x61C2897ceF370fba33D8aA7270861f949D7fA5dc"
  const MerkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop");
  const airdrop = await MerkleAirdrop.deploy(root, tokenAddress, owner );
  await airdrop.waitForDeployment();

  console.log("Airdrop deployed to:", airdrop.target);

  // Save deployed info
  fs.writeFileSync(path.join(__dirname, 'deployed.json'), JSON.stringify({
    address: airdrop.address,
    root
  }, null, 2));
}
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
