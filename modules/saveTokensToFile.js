const fs = require('fs');

async function saveTokensToFile(tokens) {
    try {
        await fs.promises.writeFile('./localDatabase/erc20Tokens.json', JSON.stringify(tokens));
        return tokens;
    } catch (err) {
        console.log("Unable to write to file:", err);
        return null;
    }
};

module.exports = {
    saveTokensToFile
};