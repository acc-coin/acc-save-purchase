// @ts-ignore
import crypto from "crypto";
import { Utils } from "acc-save-purchase-sdk";
import { Scheduler } from "../modules";
import { logger } from "../service/common/Logger";
import { StorePurchaseClient } from "./Client";
import {
    ICancelPurchaseData,
    INewPurchaseData,
    INewPurchaseDetails,
    IProductData,
    IProducts,
    IShopData,
    IUserData,
} from "./types/index";

import * as fs from "fs";

export class StorePurchaseClientScheduler extends Scheduler {
    private client: StorePurchaseClient;
    private oldTimeStamp: number;
    private readonly minInterval: number;
    private readonly maxInterval: number;
    private randInterval: number;
    private blockInterval: number;
    private useCancel: boolean;

    private products: IProductData[];
    private shops: IShopData[];
    private users: IUserData[];
    private purchases: string[];

    constructor(expression: string) {
        super(expression);
        this.maxInterval = Number(process.env.MAXINTERVAL || "500");
        this.minInterval = Number(process.env.MININTERVAL || "5");
        this.blockInterval = Number(process.env.BLOCK_INTERVAL || "600");
        this.useCancel = Boolean(process.env.USE_CALCEL || "false");

        this.randInterval = 10;
        this.client = new StorePurchaseClient();
        this.oldTimeStamp = Utils.getTimeStamp();
        this.products = [];
        this.shops = [];
        this.users = [];
        this.purchases = [];
    }

    public async onStart() {
        await this.loadData();
    }

    public async loadData() {
        this.users.push(...(JSON.parse(fs.readFileSync("./src/client/data/users.json", "utf8")) as IUserData[]));
        this.shops.push(...(JSON.parse(fs.readFileSync("./src/client/data/shops.json", "utf8")) as IShopData[]));
        this.products.push(
            ...(JSON.parse(fs.readFileSync("./src/client/data/products.json", "utf8")) as IProductData[])
        );
    }

    protected override async work() {
        try {
            const newTimeStamp = Utils.getTimeStamp();

            let old_period = Math.floor(this.oldTimeStamp / this.randInterval);
            let new_period = Math.floor(newTimeStamp / this.randInterval);

            if (old_period === new_period) return;

            old_period = Math.floor(this.oldTimeStamp / 600);
            new_period = Math.floor(newTimeStamp / 600);

            if (old_period !== new_period) {
                const factor = 600 / this.blockInterval;
                this.randInterval = Math.floor(
                    (Math.log(this.minInterval + Math.random() * (this.maxInterval - this.minInterval)) * 80 - 250) /
                        factor
                );
                if (this.randInterval < 5) this.randInterval = 5;
                console.log(`interval : ${this.randInterval}`);
            }

            this.oldTimeStamp = newTimeStamp;

            if (this.purchases.length > 0 && Math.random() < 0.3) {
                const tx = await this.makeCancelTransactions();
                if (tx !== undefined) {
                    console.log("Send: ", JSON.stringify(tx));
                    await this.client.sendCancelTransaction(tx);
                }
            } else {
                const tx = await this.makeTransactions();
                console.log("Send: ", JSON.stringify(tx));
                await this.client.sendTransaction(tx);
            }
        } catch (error) {
            logger.error(`Failed to execute the node scheduler: ${error}`);
        }
    }

    private makeProductInPurchase(): IProducts[] {
        const res: IProducts[] = [];
        const count = Math.floor(Math.random() * 10 + 1);
        for (let idx = 0; idx < count; idx++) {
            const i = Math.floor(Math.random() * this.products.length);
            const l = Math.floor(Math.random() * 2 + 1);
            res.push({
                product: this.products[i],
                count: l,
            });
        }
        return res;
    }

    private async makeTransactions(): Promise<INewPurchaseData> {
        const purchaseId = "91313" + new Date().getTime().toString();
        const products = this.makeProductInPurchase();
        let totalAmount: number = 0;
        for (const elem of products) {
            totalAmount += elem.product.amount * elem.count;
        }
        const details: INewPurchaseDetails[] = products.map((m) => {
            return {
                productId: m.product.productId,
                amount: m.product.amount * m.count,
                providePercent: m.product.providerPercent,
            };
        });
        const cashAmount = totalAmount;

        const userIndex = Math.floor(Math.random() * this.users.length);
        const shopIndex = Math.floor(Math.random() * this.shops.length);

        if (Math.random() < 0.3) {
            this.purchases.push(purchaseId);
        }

        if (Math.random() < 0.2) {
            const res: INewPurchaseData = {
                purchaseId,
                timestamp: Utils.getTimeStampBigInt().toString(),
                totalAmount,
                cashAmount,
                currency: "krw",
                shopId: this.shops[shopIndex].shopId,
                waiting: 10,
                userAccount: "",
                userPhone: this.users[userIndex].phone,
                details,
            };
            return res;
        } else {
            const res: INewPurchaseData = {
                purchaseId,
                timestamp: Utils.getTimeStampBigInt().toString(),
                totalAmount,
                cashAmount,
                currency: "krw",
                shopId: this.shops[shopIndex].shopId,
                waiting: 10,
                userAccount: this.users[userIndex].address,
                userPhone: "",
                details,
            };
            return res;
        }
    }

    private async makeCancelTransactions(): Promise<ICancelPurchaseData | undefined> {
        const purchaseId = this.purchases.shift();
        if (purchaseId !== undefined) {
            const res: ICancelPurchaseData = {
                purchaseId,
                timestamp: Utils.getTimeStampBigInt().toString(),
            };
            return res;
        } else return undefined;
    }
}
