// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Block {
    uint number;
    string preBlockUtxoRootHash;
    string curBlockUtxoRootHash;
}

contract OmniverseZK is Ownable {
    Block[] blocks;

    /**
     * @notice Provided block number is not match with the number recorded in the contract
     * @param number Provided block number
     * @param nextNumber The next block number recorded in the contract
     */
    error OmniverseZKBlockNumberNotMatch(uint number, uint nextNumber);

    /**
     * Contract initialization.
     */
    constructor() Ownable(msg.sender) {
    }

    function addBlock(
        uint number,
        string memory preBlockUtxoRootHash,
        string memory curBlockUtxoRootHash
    ) public onlyOwner {
        if (number != blocks.length) {
            revert OmniverseZKBlockNumberNotMatch(number, blocks.length);
        }

        Block storage b = blocks.push();
        b.number = number;
        b.preBlockUtxoRootHash = preBlockUtxoRootHash;
        b.curBlockUtxoRootHash = curBlockUtxoRootHash;
    }

    function getBlock(uint number) public view returns (Block memory) {
        return blocks[number];
    }

    function getNextBlockNumber() public view returns (uint) {
        return blocks.length;
    }
}
