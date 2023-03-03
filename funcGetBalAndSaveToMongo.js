/* 1. сделать ф-ю которая получает список монет из того апи которое мы писали, и сохраняет в бд - монго 
каждую монету по отдельности, но только те, у которых есть баланс. 
все методы должны быть реализованы на промисах, либо использовать станадртные методы с промисами
   2. кроме сохранения в бд записать в файл информацию о монетах и балансах */ 

const axios = require('axios');
const Web3 = require('web3');
const erc20Abi = require('erc-20-abi');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/64a2626b0570450fb688d9f7c0866316'));
const walletAddress = '0xA145ac099E3d2e9781C9c848249E2e6b256b030D';
const API = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

function getCoinsListFromApi() {
    return axios.get(API)
        .then(response => {
            const erc20Coins = response.data.filter((coin) => coin.platforms && coin.platforms.ethereum);
            return erc20Coins;
        });
};

function saveCoinsToFile(coins) {
    fs.promises.writeFile("./erc20Coins", JSON.stringify(coins))
        .then(() => {
            console.log("Successfully wrote to file");
        })
        .catch((e) => {
            console.log("Unable to write to file ", e);
        });
};

function getCoinsList() {
  const filePath = "./erc20Coins";
  if (fs.existsSync(filePath)) {
    return fs.promises
      .readFile(filePath, "utf8")
      .then((updatedCoinsList) => {
        return updatedCoinsList;
      })
      .catch((e) => {
        console.error("Error during coins list read:", e);
        return null;
      });
  } else {
    return getCoinsListFromApi()
      .then((coins) => {
        return saveCoinsToFile(coins);
      })
      .catch((e) => {
        console.error("Error during coins list update:", e);
        return null;
      });
  }
};

function getTokenBalance(walletAddress) {
    return getCoinsList()
        .then((coinList) => {
            coinList = JSON.parse(coinList);
            const tokenBalances = [];

            for (const coin of coinList) {
                const platforms = coin.platforms;
                if (platforms && typeof platforms === "object" && platforms.ethereum) {
                    const tokenContract = new web3.eth.Contract(
                        erc20Abi,
                        platforms.ethereum
                    );
                    return tokenContract.methods.balanceOf(walletAddress).call()
                        .then((balance) => {
                            console.log({ balance });
                            if (balance > 0) {
                                tokenBalances.push({
                                    tokenAddress: platforms.ethereum,
                                    name: coin.name,
                                    balance: balance,
                                });
                            }
                        });
                }
            }
            return tokenBalances;
        })
        .catch((error) => {
            console.error("Error getting token balance: ", error);
            return null;
        });
};

getTokenBalance(walletAddress);