const fs = require('fs');

async function saveTokenBalancesToFile(tokenBalances, filename) {
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