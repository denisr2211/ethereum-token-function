const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API = process.env.API;

async function getTokensListFromApi() {
  try {
    const response = await axios.get(API);
    const erc20Tokens = response.data.filter((token) => token.platforms && token.platforms.ethereum);
    return erc20Tokens;
  } catch (err) {
    console.error(`Error getting token list from API: ${err}`);
    throw err;
  }
};

module.exports = {
  getTokensListFromApi
};