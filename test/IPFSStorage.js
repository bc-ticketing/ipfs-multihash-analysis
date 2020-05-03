const IPFSStorage = artifacts.require("IPFSStorage.sol");
const multihashes = require("multihashes");

// util function to decode IPFS CID
const cidToArgs = (cid) => {
  const mh = multihashes.fromB58String(Buffer.from(cid));
  return {
    hashFunction: "0x" + mh.slice(0, 1).toString("hex"),
    size: "0x" + mh.slice(1, 2).toString("hex"),
    digest: "0x" + mh.slice(2).toString("hex"),
  };
};

// util function to recover IPFS CID
const argsToCid = (hashFunction, size, digest) => {
  const hashHex = hashFunction.slice(2) + size.slice(2) + digest.slice(2);
  const hashBytes = Buffer.from(hashHex, "hex");
  return multihashes.toB58String(hashBytes);
};

contract("IPFSStorage", function (accounts) {
  const cid = "QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u";

  let instance;
  let gasPrice;

  // given a transaction, print its gas costs
  const printGasSummary = (tx) => {
    let gasUsed = tx.receipt.gasUsed;
    console.log("gasUsed: " + gasUsed + " units");

    let gasCost = gasUsed * gasPrice;
    console.log("gasCost (wei): " + gasCost + " wei");

    let gasCostEth = web3.utils.fromWei(gasCost.toString(), "ether");
    console.log("gasCost (ether): " + gasCostEth + " ether");
  };

  before(async () => {
    gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice: " + gasPrice);
    instance = await IPFSStorage.deployed();
  });

  it("should return the initial IPFS CID", async () => {
    const args = cidToArgs(cid);
    const decodedCid = argsToCid(args.hashFunction, args.size, args.digest);
    assert.equal(
      cid,
      decodedCid,
      "The IPFS CID was not encoded/decoded correctly."
    );
  });

  it("should store the IPFS CID as a string", async () => {
    const tx = await instance.storeCIDAsString(cid, { from: accounts[0] });
    printGasSummary(tx);
  });

  it("should store the IPFS CID as a struct", async () => {
    const args = cidToArgs(cid);

    const tx = await instance.storeCIDAsStruct(
      args.hashFunction,
      args.size,
      args.digest,
      { from: accounts[0] }
    );

    printGasSummary(tx);
  });

  it("should store the IPFS CID in the logs", async () => {
    let tx = await instance.storeCIDInTheLog(cid, { from: accounts[0] });
    printGasSummary(tx);
  });

  it("should store the IPFS CID as a struct in the logs", async () => {
    const args = cidToArgs(cid);

    const tx = await instance.storeCIDStructInTheLog(
      args.digest,
      args.hashFunction,
      args.size,
      { from: accounts[0] }
    );

    printGasSummary(tx);
  });
});
