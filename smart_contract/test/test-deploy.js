const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions", function () {
  let transactionsFactory, transactionsContract;
  beforeEach(async function () {
    transactionsFactory = await ethers.getContractFactory("Transactions");
    console.log("Deploying contract...");
    transactionsContract = await transactionsFactory.deploy();
  });

  it("should deploy", async function () {
    expect(transactionsContract.address).to.exist;
  });

  it("should add data to blockchain", async function () {
    const tx = await transactionsContract.addToBlockchain(
      "0x621611585965cb195a628ddbf631db6c50b3291c",
      1000000000000000,
      "hello test",
      "keyword"
    );
    expect(tx.hash).to.exist;
  });

  it("should get data from blockchain", async function () {
    const tx = await transactionsContract.getTransactionCount();
    expect(tx).to.exist;
  });

  it("should not return an empty array", async function () {
    const tx = await transactionsContract.getAllTransactions();
    expect(tx).length.to.be.greaterThan(0);
  });
});
