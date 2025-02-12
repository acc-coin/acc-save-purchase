/**
 *  This tests the serialization and deserialization
 *
 *  Copyright:
 *      Copyright (c) 2024 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { Block, CancelTransaction, Hash, hashFull, NewTransaction, PurchaseDetails, Utils } from "../src";

import * as assert from "assert";

import { BigNumber } from "@ethersproject/bignumber";
import { Wallet } from "@ethersproject/wallet";

describe("Test of Block", () => {
    const phoneHash = Utils.getPhoneHash("8201012341234");
    it("Test buildMerkleTree", () => {
        const txs = [];
        const txs_hash = [];
        for (let idx = 0; idx < 7; idx++) {
            txs.push(
                new NewTransaction(
                    BigInt(0),
                    (12345670 + idx).toString(),
                    BigInt(1668044556),
                    BigInt(0),
                    BigNumber.from(idx + 1),
                    BigNumber.from(idx + 1),
                    BigNumber.from(idx + 1),
                    "krw",
                    "0x5f59d6b480ff5a30044dcd7fe3b28c69b6d0d725ca469d1b685b57dfc1055d7f",
                    "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
                    phoneHash,
                    [new PurchaseDetails("PID001", BigNumber.from(idx + 1), BigNumber.from(300))],
                    "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                    "",
                    "",
                    "",
                    ""
                )
            );
            txs_hash.push(hashFull(txs[idx]));
        }

        const merkel_tree = Block.buildMerkleTree(txs_hash);
        assert.strictEqual(merkel_tree.length, txs_hash.length + 7);
    });

    it("Test createBlock", () => {
        const txs = [
            new NewTransaction(
                BigInt(0),
                "00000000",
                BigInt(1668044556),
                BigInt(0),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                "krw",
                "0x0000000000000000000000000000000000000000",
                "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
                phoneHash,
                [new PurchaseDetails("PID001", BigNumber.from(1000000000), BigNumber.from(300))],
                "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                "",
                "",
                "",
                ""
            ),
            new NewTransaction(
                BigInt(1),
                "00000001",
                BigInt(1668044556),
                BigInt(0),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                "krw",
                "0x0000000000000000000000000000000000000000",
                "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
                phoneHash,
                [new PurchaseDetails("PID001", BigNumber.from(1000000000), BigNumber.from(300))],
                "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                "",
                "",
                "",
                ""
            ),
            new NewTransaction(
                BigInt(2),
                "00000002",
                BigInt(1668044556),
                BigInt(0),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                "krw",
                "0x0000000000000000000000000000000000000000",
                "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
                phoneHash,
                [new PurchaseDetails("PID001", BigNumber.from(1000000000), BigNumber.from(300))],
                "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                "",
                "",
                "",
                ""
            ),
            new NewTransaction(
                BigInt(3),
                "00000003",
                BigInt(1668044556),
                BigInt(0),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                "krw",
                "0x0000000000000000000000000000000000000000",
                "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
                phoneHash,
                [new PurchaseDetails("PID001", BigNumber.from(1000000000), BigNumber.from(300))],
                "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                "",
                "",
                "",
                ""
            ),
            new NewTransaction(
                BigInt(4),
                "00000004",
                BigInt(1668044556),
                BigInt(0),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                BigNumber.from(1000000000),
                "krw",
                "0x0000000000000000000000000000000000000000",
                "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
                phoneHash,
                [new PurchaseDetails("PID001", BigNumber.from(1000000000), BigNumber.from(300))],
                "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                "",
                "",
                "",
                ""
            ),
            new CancelTransaction(
                BigInt(4),
                "00000004",
                BigInt(1668044556),
                BigInt(0),
                "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
                "",
                "",
                "",
                ""
            ),
        ];
        const signer = new Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
        const prev_hash = Hash.Null;
        const prev_height = BigInt(0);

        const block = Block.createBlock(prev_hash, prev_height, txs);
        const block_string = JSON.stringify(block);
        const block_json = JSON.parse(block_string);

        const block2 = Block.reviver("", block_json);

        assert.deepStrictEqual(block, block2);

        // Check hash of Block
        assert.deepStrictEqual(hashFull(block2), hashFull(block2.header));
    });
});
