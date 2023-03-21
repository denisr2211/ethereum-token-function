import express from 'express';
import saveTokenBalancesToFile from './modules/saveTokenBalanceToFile';
import getTokensList from './modules/getTokensList';
import getTokenBalanceFromWallet from './servicesAPI/getTokenBalanceFromWallet';
import { config } from 'dotenv';
import TokenBal from './interface/InterfaceTokenBal';
import Token from './interface/InterfaceToken';

config();

const walletAddress: string = process.env.WALLET_ADDRESS!;
const PORT: string | number = process.env.PORT || 3000;
const app = express();

async function getBalances(): Promise<Array<TokenBal> | null> {
    try {
        const tokenList: Array<Token> | null = await getTokensList();
        if (tokenList == null) {
            throw new Error("Cant get list of available tokens");
        }
        const tokenBalancesFromWallet: Array<TokenBal> | null = await getTokenBalanceFromWallet(walletAddress, tokenList)
            .then((tokenBalancesFromWallet) => {
                return saveTokenBalancesToFile(tokenBalancesFromWallet, '../task-Kot-1/localDatabase/erc20TokenBalances.json');
            });
        return tokenBalancesFromWallet;
    } catch (err: any) {
        console.error(`Error saving token balances to file`);
        console.log(err.message);
        return null;
    }
};

app.get('/token-balances', async (req, res) => {
    try {
        const newTokenBalances: Array<TokenBal> | null = await getBalances();
        res.send(newTokenBalances);
        res.status(200).json(newTokenBalances);
    } catch (err) {
        res.status(500).send('Error saving token balances to file');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

async function runGetBalances() {
    try {
        await getBalances();
    } catch (err: any) {
        console.log(`Error getting balances: ${err.message}`);
    }
    setTimeout(runGetBalances, 3600000);
};

runGetBalances();