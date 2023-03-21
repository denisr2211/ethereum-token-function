import axios from 'axios';
import dotenv from 'dotenv';
import Token from '../interface/InterfaceToken';
dotenv.config();

const API: string | undefined = process.env.API;

async function getTokensListFromApi(): Promise<Array<Token>> {
  try {
    if (API === undefined) {
      throw new Error('API URL is not defined');
    }
    const response = await axios.get(API);
    const responseData = response.data;
    const erc20Tokens = responseData.filter((token: Token) => token.platforms && token.platforms.ethereum);
    return erc20Tokens;
  } catch (err) {
    console.error(`Error getting token list from API: ${err}`);
    throw err;
  }
};

export default getTokensListFromApi;