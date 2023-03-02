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

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/64a2626b0570450fb688d9f7c0866316'));
const walletAddress = '0xA145ac099E3d2e9781C9c848249E2e6b256b030D';
const API = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

async function getCoinsList() {
    const { data } = await axios.get(API);
    const erc20Coins = data.filter((coin) => coin.platforms && coin.platforms.ethereum);
    return erc20Coins;
};

async function saveCoinsToFile(coins) {
    try {
        await fs.promises.writeFile("./erc20Coins", JSON.stringify(coins));
        console.log("Successfully wrote to file");
    } catch (e) {
        console.log("Unable to write to file ", e);
    }
};

async function updateCoinsList() {
    try {
        const coins = await getCoinsList();
        await saveCoinsToFile(coins);
        const filePath = './erc20Coins';
        if (fs.existsSync(filePath)) {
            const updatedCoinsList = await readFile(filePath, 'utf8');
            return updatedCoinsList;
        } else {
            console.log("File does not exist");
            return null;
        }
    } catch (e) {
        console.error('Error during coins list update:', e);
        return null;
    }
};

async function getTokenBalance(walletAddress) {
    coinList = await updateCoinsList();
    const tokenBalances = [];

    for (const coin of coinList) {
        const platforms = coin.platforms;
        if (platforms && typeof platforms === 'object' && platforms.ethereum) {
            const tokenContract = new web3.eth.Contract(erc20Abi, platforms.ethereum);
            const balance = await tokenContract.methods.balanceOf(walletAddress).call();
            
            if (balance > 0) {
                tokenBalances.push({
                    tokenAddress: platforms.ethereum,
                    name: coin.name,
                    balance: balance
                });
            }
        }
    }
    console.log({ tokenBalances });
    return tokenBalances;
}

getTokenBalance(walletAddress);