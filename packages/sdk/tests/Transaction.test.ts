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
            ""
        );
        await tx.sign(signer1);

        assert.strictEqual(
            hashFull(tx).toString(),
            "0x933f736bdf9dda0092d05ac91066fd3048260094ace55221761fbd3b923a1ca6"
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
            ""
        );

        await tx.sign(signer1);
        assert.strictEqual(
            tx.signature,
            "0x4929e7562eb3379bdfb74441cb38c6919a07df903fb3904b100b2c973bb7e61e5b1a84f4d9a044af255bd003093c2f258ed634a52ea7cad0fb29e0a49dc719951b"
        );
        assert.ok(!tx.verify(signer2.address));
        assert.ok(tx.verify(signer1.address));
        assert.ok(tx.verify());

        await tx.sign(signer2);
        assert.strictEqual(
            tx.signature,
            "0x0398eb6ba47149acff4bafe9b756fa60b4f97877bc88b02da70fd60916430c3e6e00f532abe412309c914e607402d4177aa526b52f6379bfb0d0425744f3839f1c"
        );
        assert.ok(!tx.verify(signer1.address));
        assert.ok(tx.verify(signer2.address));
        assert.ok(tx.verify());
    });
});
