const fs = require('fs');
const { saveTokensToFile } = require('./saveTokensToFile');
const api = require('./getTokensListFromApi');
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function getTokensList() {
    const filePath = "../../task-Kot-1/localDatabase/erc20Tokens.json";
    if (fs.existsSync(filePath)) {
        try {
            const updatedTokensList = await fs.promises.readFile(filePath, "utf8");
            console.log("Successfully read from the storage of tokens.");
            return updatedTokensList;
        } catch (e) {
            console.error("Error during tokens list read:", e);
            return null;
        }
    } else {
        try {
            const tokens = await api.getTokensListFromApi();
            console.log("Successfully obtained from API tokens.");
            const savedTokens = await saveTokensToFile(tokens);
            return savedTokens;
        } catch (e) {
            console.error("Error during tokens list update:", e);
            return null;
        }
    }
};

module.exports = {
    getTokensList
};

// function getTokensList() {
//     const filePath = "../localDatabase/erc20Tokens.json";
//     if (fs.existsSync(filePath)) {
//         return fs.promises.readFile(filePath, "utf8").then((updatedTokensList) => {
//             console.log("Successfully read from the storage of tokens.");
//             return updatedTokensList;
//         })
//             .catch((e) => {
//                 console.error("Error during tokens list read:", e);
//                 return null;
//             });
//     } else {
//         return api.getTokensListFromApi()
//             .then((tokens) => {
//                 console.log("Successfully obtained from API tokens.");
//                 return saveTokensToFile(tokens);
//             })
//             .then((savedTokens) => {
//                 console.log("Successfully saved tokens to file.");
//                 return savedTokens;
//             })
//             .catch((e) => {
//                 console.error("Error during tokens list update:", e);
//                 return null;
//             });
//     }
// };