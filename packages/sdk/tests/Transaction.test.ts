/**
 *  Test of NewTransaction
 *
 *  Copyright:
 *      Copyright (c) 2024 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { hashFull, NewTransaction, PurchaseDetails, Utils } from "../src";

import { BigNumber } from "@ethersproject/bignumber";
import { Wallet } from "@ethersproject/wallet";

import * as assert from "assert";

describe("NewTransaction", () => {
    const signer1 = new Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
    const signer2 = new Wallet("0x023beec95e3e47cb5b56bb8b5e4357db4b8565aef61eaa661c11ebbac6a6c4e8");

    const phoneHash = Utils.getPhoneHash("8201012341234");
    // The test codes below compare with the values calculated in Agora.
    it("Test for hash value of NewTransaction data", async () => {
        const tx = new NewTransaction(
            "0",
            "12345678",
            BigInt(1668044556),
            BigInt(0),
            BigNumber.from(123),
            BigNumber.from(123),
            BigNumber.from(123),
            "krw",
            "0x5f59d6b480ff5a30044dcd7fe3b28c69b6d0d725ca469d1b685b57dfc1055d7f",
            "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
            phoneHash,
            [new PurchaseDetails("PID001", BigNumber.from(123), BigNumber.from(300))],
            "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
            "",
            "",
            "",
            "",
            ""
        );
        await tx.sign(signer1);

        assert.strictEqual(
            hashFull(tx).toString(),
            "0xff5793f607c2836e99da571190f9b7fed0f51823073352e8b467459b49245990"
        );
    });

    it("Test for NewTransaction.clone()", async () => {
        const tx = new NewTransaction(
            "0",
            "12345678",
            BigInt(1668044556),
            BigInt(0),
            BigNumber.from(123),
            BigNumber.from(123),
            BigNumber.from(123),
            "krw",
            "0x5f59d6b480ff5a30044dcd7fe3b28c69b6d0d725ca469d1b685b57dfc1055d7f",
            "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
            phoneHash,
            [new PurchaseDetails("PID001", BigNumber.from(123), BigNumber.from(300))],
            "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
            "",
            "",
            "",
            ""
        );
        await tx.sign(signer1);

        const clone_tx = tx.clone();
        assert.deepStrictEqual(tx, clone_tx);
    });

    it("Test for NewTransaction.sign() & verify", async () => {
        const tx = new NewTransaction(
            BigInt(0),
            "12345678",
            BigInt(1668044556),
            BigInt(0),
            BigNumber.from(123),
            BigNumber.from(123),
            BigNumber.from(123),
            "krw",
            "0x5f59d6b480ff5a30044dcd7fe3b28c69b6d0d725ca469d1b685b57dfc1055d7f",
            "0xD10ADf251463A260242c216c8c7D3e736eBdB398",
            phoneHash,
            [new PurchaseDetails("PID001", BigNumber.from(123), BigNumber.from(300))],
            "0x4501F7aF010Cef3DcEaAfbc7Bfb2B39dE57df54d",
            "",
            "",
            "",
            ""
        );

        await tx.sign(signer1);
        assert.strictEqual(
            tx.signature,
            "0x6ff15db25fd9cd992e17755036905a0562b3e19703b5efe1fa6a0573ed86a22d39a4531dfd4a19ca27c1e066c277731bc76f95258e237f82d0dbcd7b1789e5701b"
        );
        assert.ok(!tx.verify(signer2.address));
        assert.ok(tx.verify(signer1.address));
        assert.ok(tx.verify());

        await tx.sign(signer2);
        assert.strictEqual(
            tx.signature,
            "0xc1634936c9ec8884aab59c027689ca5d051add8d498ee2bf9e4e4dac2cb2d8d934ae3c9d1c6fbeebda80e89e862d67e8775d78a77eeb5d28ad01f0c9c9e19c441c"
        );
        assert.ok(!tx.verify(signer1.address));
        assert.ok(tx.verify(signer2.address));
        assert.ok(tx.verify());
    });
});
