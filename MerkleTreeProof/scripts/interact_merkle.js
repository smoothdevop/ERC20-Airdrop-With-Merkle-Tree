const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const MerkleTreeData = require("../scripts/merkle_proof/outputs_file/permitted_claim.json");
const ClaimersDetails = require("../scripts/merkle_proof/outputs_file/token_claimlist.json");

// helpers
async function main() {
  const MERKLE_ERC20 = await ethers.getContractFactory("MerkleToken");
  const merkle_erc20 = await MERKLE_ERC20.deploy();

  await merkle_erc20.deployed();

  console.log(`merkle erc20 deployed to ${merkle_erc20.address}`);

  //user to call function

  const claimerAddress = "0x328809bc894f92807417d2dad6b7c998c1afdac6";

  await helpers.impersonateAccount(claimerAddress);
  const userOneSigner = await ethers.getSigner(claimerAddress);
  // console.log(userOneSigner);

  const userOneFirstBalance = await merkle_erc20.balanceOf(
    userOneSigner.address
  );
  console.log("User one old balance\n", userOneFirstBalance.toString());

  const tx = await merkle_erc20.claimToken(
    claimerAddress,
    ClaimersDetails[claimerAddress].amount,
    MerkleTreeData[claimerAddress].proof
  );
  const tx2 = await tx.wait();
  console.log(tx2);

  const userOneBalance = await merkle_erc20.balanceOf(userOneSigner.address);
  console.log("User one new balance\n", userOneBalance.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.`
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
