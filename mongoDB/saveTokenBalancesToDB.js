const { TokenBalance } = require('./tokenBalanceSchema');

async function saveTokenBalancesToDB(tokenBalances = []) {
  try {
    if (!Array.isArray(tokenBalances)) {
      console.log("Unable to save token balances to database: invalid input");
      return null;
    }
    const promises = tokenBalances.map(tokenBalance => {
      const name = tokenBalance.name;
      const balance = tokenBalance.balance;
      return TokenBalance.create({ name, balance });
    });

    const results = await Promise.all(promises);
  
    return results;
  } catch (err) {
    console.log("Unable to save token balances to Mongo DB:", err);
    return null;
  }
};

module.exports = {
  saveTokenBalancesToDB
};