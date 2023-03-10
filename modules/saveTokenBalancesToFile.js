const fs = require('fs');
const getTokenBalanceFromWallet = require('./getTokenBalanceFromWallet');

async function saveTokenBalancesToFile(walletAddress, filename) {
    const tokenBalances = await getTokenBalanceFromWallet(walletAddress);
    try {
        const data = JSON.stringify(tokenBalances);
        fs.writeFileSync(filename, data);
        console.log(`Token balances saved to ${filename}`);
    } catch (err) {
        console.log(`Error writing token balances to file: ${err.message}`);
    }
};

module.exports = {
    saveTokenBalancesToFile
};