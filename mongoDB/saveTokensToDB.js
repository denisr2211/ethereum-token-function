const Token = require('./tokensSchema');

async function saveTokensToDB(tokens) {
  try {
    const savedTokens = await Token.create(tokens);
    console.log(`Saved array erc20 tokens to Mongo DB.`);
    return savedTokens;
  } catch (err) {
    console.error("Error during token save:", err);
    return null;
  }
}

module.exports = {
  saveTokensToDB
};