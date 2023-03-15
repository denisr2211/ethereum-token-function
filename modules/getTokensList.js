const fs = require('fs');
const { saveTokensToFile } = require('./saveTokensToFile');
const api = require('../servicesAPI/getTokensListFromApi');

async function getTokensList() {
    const filePath = "../../task-Kot-1/localDatabase/erc20Tokens.json";
    if (fs.existsSync(filePath)) {
        try {
            const updatedTokensList = JSON.parse(await fs.promises.readFile(filePath, "utf8"));
            console.log("Successfully read from the storage of tokens.");
            return updatedTokensList;
        } catch (err) {
            console.error("Error during tokens list read:", err);
            return null;
        }
    } else {
        try {
            const tokens = await api.getTokensListFromApi();
            console.log("Successfully obtained from API tokens.");
            const savedTokens = await saveTokensToFile(tokens);
            return savedTokens;
        } catch (err) {
            console.error("Error during tokens list update:", err);
            return null;
        }
    }
};

module.exports = {
    getTokensList
};