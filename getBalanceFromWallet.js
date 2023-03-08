/* 1. сделать ф-ю которая получает список монет из того апи которое мы писали, и сохраняет в бд - монго 
каждую монету по отдельности, но только те, у которых есть баланс. 
все методы должны быть реализованы на промисах, либо использовать станадртные методы с промисами
   2. кроме сохранения в бд записать в файл информацию о монетах и балансах */

const axios = require('axios');
const Web3 = require('web3');
const erc20Abi = require('human-standard-token-abi');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/64a2626b0570450fb688d9f7c0866316'), {chain: 'mainnet'});
const walletAddress = '0xA145ac099E3d2e9781C9c848249E2e6b256b030D';
const API = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

function getCoinsListFromApi() {
  return axios.get(API)
    .then(response => {
      const erc20Coins = response.data.filter((coin) => coin.platforms && coin.platforms.ethereum);
      return erc20Coins;
    });
};

async function saveCoinsToFile(coins) {
  try {
    await fs.promises.writeFile("./erc20Coins", JSON.stringify(coins));
    console.log("Successfully wrote to file.");
    return coins;
  } catch (e) {
    console.log("Unable to write to file:", e);
    return null;
  }
};

function getCoinsList() {
  const filePath = "./erc20Coins";
  if (fs.existsSync(filePath)) {
    return fs.promises.readFile(filePath, "utf8").then((updatedCoinsList) => {
      console.log("Successfully read from the storage of tokens.");
      return updatedCoinsList;
    })
      .catch((e) => {
        console.error("Error during coins list read:", e);
        return null;
      });
  } else {
    return getCoinsListFromApi()
      .then((coins) => {
        console.log("Successfully obtained from API tokens.");
        return saveCoinsToFile(coins);
      })
      .catch((e) => {
        console.error("Error during coins list update:", e);
        return null;
      });
  }
};

async function getBalanceOfEthereum() {
  let balance = await web3.eth.getBalance(walletAddress);
  return { coin: "Ethereum", balance: web3.utils.fromWei(balance, "ether") };
};

async function getTokenBalance(walletAddress) {
  const coinList = JSON.parse(await getCoinsList());
  const tokenBalances = [];
  const promises = [];

  const ethereumBalance = await getBalanceOfEthereum();
  tokenBalances.push(ethereumBalance);

  for (const coin of coinList) {
    const platforms = coin.platforms;
    if (platforms && typeof platforms === 'object' && platforms.ethereum) {
      const tokenContract = new web3.eth.Contract(erc20Abi, platforms.ethereum);
      const p = tokenContract.methods.balanceOf(walletAddress).call()
        .then(balance => {
          if (balance > 0) {
            balance = web3.utils.fromWei(balance, "ether");
            tokenBalances.push({
              name: coin.name,
              balance: balance,
            });
          }
        })
        .catch(err => {
          console.log(`Error getting balance for ${coin.name}: ${err.message}`);
        });
      promises.push(p);
    }
  }
  await Promise.all(promises);
  return tokenBalances;
};

getTokenBalance(walletAddress);