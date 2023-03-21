import fs from 'fs';
import saveTokensToFile from './saveTokensToFile';
import getTokensListFromApi from '../servicesAPI/getTokensListFromApi';
import Token from '../interface/InterfaceToken';

async function getTokensList(): Promise<Array<Token> | null> {
    const filePath: string = "localDatabase/erc20Tokens.json";
    try {
        fs.existsSync(filePath);
        const updatedTokensList: Array<Token> = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log("Successfully read from the storage of tokens.");
        return updatedTokensList;
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            try {
                const tokens = await getTokensListFromApi();
                console.log("Successfully obtained from API tokens.");
                const savedTokens = await saveTokensToFile(tokens);
                return savedTokens;
            } catch (err) {
                console.error("Error during tokens list update:", err);
                return null;
            }
        }
        console.error("Error during tokens list read:", err);
        return null;
    }
};

export default getTokensList;