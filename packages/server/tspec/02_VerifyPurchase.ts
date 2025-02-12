import { Tspec } from "tspec";

export type VerifyPurchaseApiSpec = Tspec.DefineApiSpec<{
    tags: ["Verify Purchase"];
    paths: {
        "/purchase/verify": {
            get: {
                summary: "Verify Purchase";
                query: {
                    /**
                     * ID of Purchase
                     * @example "P00000000000203"
                     */
                    purchaseId: string;
                };
                responses: {
                    200: {
                        /**
                         * ID of Purchase
                         * @example "P00000000000203"
                         */
                        purchaseId: string;
                        /**
                         * Time the purchase occurred
                         * @example "1722945138"
                         */
                        timestamp: string;
                        /**
                         * Cash Amount to be used for payment
                         */
                        amount: string;
                        /**
                         * Currency symbol for amount to be used for payment
                         * @example "php"
                         */
                        currency: string;
                    };
                };
            };
        };
    };
}>;
