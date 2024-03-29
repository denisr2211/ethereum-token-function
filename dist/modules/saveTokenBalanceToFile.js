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
const fs_1 = __importDefault(require("fs"));
function saveTokenBalancesToFile(tokenBalances, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                date: new Date().toUTCString(),
                balances: tokenBalances
            };
            const jsonData = JSON.stringify(data);
            fs_1.default.writeFileSync(filename, jsonData);
            console.log(`Token balances saved to ${filename}`);
            return tokenBalances;
        }
        catch (err) {
            console.log(`Error writing token balances to file: ${err.message}`);
            return null;
        }
    });
}
;
exports.default = saveTokenBalancesToFile;
