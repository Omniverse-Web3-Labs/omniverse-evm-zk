const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOmniverseBaseFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Omni = await ethers.getContractFactory("OmniverseZK");
    const omni = await Omni.deploy();

    return { omni, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { omni, owner } = await loadFixture(deployOmniverseBaseFixture);

      expect(await omni.owner()).to.equal(owner.address);
    });
  });

  describe("Add block", function () {
    it("Should revert with sener not owner", async function () {
      const { omni, otherAccount } = await loadFixture(deployOmniverseBaseFixture);

      await expect(omni.connect(otherAccount).addBlock(0, "preHash", "curHash")).to.be.revertedWithCustomError(
        omni,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should revert with provided block number error", async function () {
      const { omni, owner } = await loadFixture(deployOmniverseBaseFixture);

      await expect(omni.connect(owner).addBlock(1, "preHash", "curHash")).to.be.revertedWithCustomError(
        omni,
        "OmniverseZKBlockNumberNotMatch"
      );
    });

    it("Should pass", async function () {
      const { omni, owner } = await loadFixture(
        deployOmniverseBaseFixture
      );

      // We use omni.connect() to send a transaction from another account
      await omni.connect(owner).addBlock(0, "preHash", "curHash");

      let blockNumber = await omni.getNextBlockNumber();
      expect(blockNumber).to.equal(1);

      let block = await omni.getBlock(0);
      expect(block.preBlockUtxoRootHash).to.equal('preHash');
    });
  });
});
