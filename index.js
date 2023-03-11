const { saveTokenBalancesToFile } = require('./modules/saveTokenBalancesToFile');
const dotenv = require('dotenv');

dotenv.config();

const walletAddress = process.env.WALLET_ADDRESS;

async function saveBalances() {
    try {
        await saveTokenBalancesToFile(walletAddress, '../task-Kot-1/localDatabase/erc20TokenBalances.json');
        console.log('Token balances saved successfully.');
    } catch (err) {
        console.error(`Error saving token balances: ${err}`);
    }
};

saveBalances();