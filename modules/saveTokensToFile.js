const fs = require('fs');

async function saveTokensToFile(tokens) {
    try {
        await fs.promises.writeFile('./localDatabase/erc20Tokens.json', JSON.stringify(tokens));
        return tokens;
    } catch (e) {
        console.log("Unable to write to file:", e);
        return null;
    }
};

module.exports = {
    saveTokensToFile
};