const { saveTokensToDB } = require('./saveTokensToDB');
const { getTokensListFromApi } = require('../servicesAPI/getTokensListFromApi');
const Token = require('../mongoDB/tokensSchema');

async function getTokensListFromDB() {
  const tokens = await Token.find();
  if (tokens.length) {
    console.log("Successfully obtained tokens from the Mongo DB.");
    return tokens;
  } else {
    try {
      const tokensFromApi = await getTokensListFromApi();
      console.log("Successfully obtained tokens from API.");
      const savedTokens = await saveTokensToDB(tokensFromApi);
      return savedTokens;
    } catch (err) {
      console.error("Error during tokens list update:", err);
      return null;
    }
  }
};

module.exports = {
  getTokensListFromDB
};