const express = require('express');
const { saveTokenBalancesToFile } = require('./modules/saveTokenBalanceToFile');
const { saveTokenBalancesToDB } = require('./mongoDB/saveTokenBalancesToDB');
const getTokenBalanceFromWallet = require('./servicesAPI/getTokenBalanceFromWallet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const walletAddress = process.env.WALLET_ADDRESS;
const PORT = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;
const app = express();

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function updateTokenBalances() {
    try {
        const tokenBalancesFromWallet = await getTokenBalanceFromWallet(walletAddress);
        const tokenBalances = await saveTokenBalancesToFile(tokenBalancesFromWallet, '../task-Kot-1/localDatabase/erc20TokenBalances.json');
        const newTokenBalances = await saveTokenBalancesToDB(tokenBalances);
        console.log(`Saved ${newTokenBalances.length} token balances to Mongo DB.`);
    } catch (err) {
        console.error(`Error saving token balances to Mongo DB: ${err}`);
    }
};

app.get('/token-balances', async (req, res) => {
    try {
        await updateTokenBalances();
        res.status(200).json(newTokenBalances);
    } catch (err) {
        res.status(500).send('Error saving token balances to Mongo DB');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

setInterval(updateTokenBalances, 60000);