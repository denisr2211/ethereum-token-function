"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saveTokenBalanceToFile_1 = __importDefault(require("./modules/saveTokenBalanceToFile"));
const getTokensList_1 = __importDefault(require("./modules/getTokensList"));
const getTokenBalanceFromWallet_1 = __importDefault(require("./servicesAPI/getTokenBalanceFromWallet"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const walletAddress = process.env.WALLET_ADDRESS;
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
function getBalances() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenList = yield (0, getTokensList_1.default)();
            if (tokenList == null) {
                throw new Error("Cant get list of available tokens");
            }
            const tokenBalancesFromWallet = yield (0, getTokenBalanceFromWallet_1.default)(walletAddress, tokenList)
                .then((tokenBalancesFromWallet) => {
                return (0, saveTokenBalanceToFile_1.default)(tokenBalancesFromWallet, '../task-Kot-1/localDatabase/erc20TokenBalances.json');
            });
            return tokenBalancesFromWallet;
        }
        catch (err) {
            console.error(`Error saving token balances to file`);
            console.log(err.message);
            return null;
        }
    });
}
;
app.get('/token-balances', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTokenBalances = yield getBalances();
        res.send(newTokenBalances);
        res.status(200).json(newTokenBalances);
    }
    catch (err) {
        res.status(500).send('Error saving token balances to file');
    }
}));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
function runGetBalances() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield getBalances();
        }
        catch (err) {
            console.log(`Error getting balances: ${err.message}`);
        }
        setTimeout(runGetBalances, 3600000);
    });
}
;
runGetBalances();
