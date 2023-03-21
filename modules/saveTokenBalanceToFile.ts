import fs from 'fs';
import TokenBal from '../interface/InterfaceTokenBal';
import Data from '../interface/interfaceData';

async function saveTokenBalancesToFile(tokenBalances: Array<TokenBal>, filename: string): Promise<Array<TokenBal> | null> {
    try {
        const data: Data = {
            date: new Date().toUTCString(),
            balances: tokenBalances
        };
        const jsonData = JSON.stringify(data);
        fs.writeFileSync(filename, jsonData);
        console.log(`Token balances saved to ${filename}`);
        return tokenBalances;
    } catch (err: any) {
        console.log(`Error writing token balances to file: ${err.message}`);
        return null;
    }
};

export default saveTokenBalancesToFile;