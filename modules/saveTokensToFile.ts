import * as fs from 'fs';
import Token from '../interface/InterfaceToken';

export async function saveTokensToFile(tokens: Array<Token>): Promise<Array<Token> | null> {
  try {
    await fs.promises.writeFile('localDatabase/erc20Tokens.json', JSON.stringify(tokens));
    return tokens;
  } catch (err) {
    console.log("Unable to write to file:", err);
    return null;
  }
};

export default saveTokensToFile;