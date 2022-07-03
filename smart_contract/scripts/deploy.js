const { ethers, run, network } = require("hardhat");

const main = async () => {
  const transactionsFactory = await hre.ethers.getContractFactory(
    "Transactions"
  );
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.deployed();

  console.log(`Deployed contract to: ${transactionsContract.address}`);

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await transactionsContract.deployTransaction.wait(6);
    await verify(transactionsContract.address, []);
  }
};

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
