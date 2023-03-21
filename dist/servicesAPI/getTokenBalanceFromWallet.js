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
const web3_1 = __importDefault(require("web3"));
const human_standard_token_abi_1 = __importDefault(require("human-standard-token-abi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const INFURA_URL = process.env.INFURA_URL;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(`${INFURA_URL}${INFURA_API_KEY}`));
function getTokenBalanceFromWallet(walletAddress, tokenList) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenBalances = [];
        const promises = [];
        try {
            const allTokens = tokenList.filter(token => token.platforms.ethereum && token.platforms.ethereum.toLowerCase() !== "0x0000000000000000000000000000000000000000")
                .map(token => ({
                name: token.name,
                address: token.platforms.ethereum
            }));
            const ethereumBalance = yield web3.eth.getBalance(walletAddress);
            const ethereumBalanceInEther = web3.utils.fromWei(ethereumBalance, "ether");
            tokenBalances.push({
                name: "ETH",
                balance: ethereumBalanceInEther,
            });
            for (const token of allTokens) {
                const tokenContract = new web3.eth.Contract(human_standard_token_abi_1.default, token.address);
                const p = tokenContract.methods.balanceOf(walletAddress).call()
                    .then((tokenBalanceInWei) => {
                    const tokenBalanceInEther = tokenBalanceInWei !== null ? web3.utils.fromWei(String(tokenBalanceInWei), "ether") : "0";
                    if (parseFloat(tokenBalanceInEther) > 0) {
                        tokenBalances.push({
                            name: token.name,
                            balance: tokenBalanceInEther,
                        });
                    }
                })
                    .catch((err) => {
                    console.log(`Error getting balance for token ${token.name}: ${err.message}`);
                });
                promises.push(p);
            }
            yield Promise.all(promises);
            if (tokenBalances.length === 0) {
                console.warn('No token balances found.');
            }
            return tokenBalances;
        }
        catch (err) {
            console.error(`Error fetching API: ${err.message}`);
            throw err;
        }
    });
}
;
exports.default = getTokenBalanceFromWallet;
