const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API = process.env.API;

function getTokensListFromApi() {
  try {
    return axios.get(API)
      .then(response => {
        const erc20Tokens = response.data.filter((coin) => coin.platforms && coin.platforms.ethereum);
        return erc20Tokens;
      })
      .catch(error => {
        console.error(`Error getting token list from API: ${error}`);
        throw error;
      });
  } catch (error) {
    console.error(`Error getting token list from API: ${error}`);
    throw error;
  }
};

module.exports = {
  getTokensListFromApi
};
