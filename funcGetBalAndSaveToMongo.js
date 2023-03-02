/* 1. сделать ф-ю которая получает список монет из того апи которое мы писали, и сохраняет в бд - монго 
каждую монету по отдельности, но только те, у которых есть баланс. 
все методы должны быть реализованы на промисах, либо использовать станадртные методы с промисами
   2. кроме сохранения в бд записать в файл информацию о монетах и балансах */ 

   const axios = require('axios');
   const Web3 = require('web3');
   const erc20Abi = require('erc-20-abi');
   const fs  = require('fs');
   const util = require('util');
   const readFile = util.promisify(fs.readFile);
   
   const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/64a2626b0570450fb688d9f7c0866316'));
   const walletAddress = '0xA145ac099E3d2e9781C9c848249E2e6b256b030D';
   const API = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';
   
   async function getCoinsList() {
       const { data } = await axios.get(API);
       const erc20Coins = data.filter((coin) => coin.platforms && coin.platforms.ethereum);
   
       try {
           fs.promises.writeFile("./erc20Coins", JSON.stringify(erc20Coins));
           console.log("Successfully wrote to file");
       } catch (e) {
           console.log("Unable to write to file ", e);
       }
       return readFile('./erc20Coins', 'utf8');
   };
   
   getCoinsList();
   
   async function getTokenBalance() {
       //const coin = await getCoinsList();
   
       const erc20CreationFilter = {        //список всех ERC20 токенов (используя метод getLogs)
           fromBlock: '0x6D517',
           toBlock: '0x126D2C',
           address: null,
           topics: [web3.utils.sha3('Transfer(address,address,uint256)')]
       };
   
       const logs = await web3.eth.getPastLogs(erc20CreationFilter);
       console.log({logs});
   
       const erc20Tokens = [];     // экземпляр контракта ERC20 для каждого токена в списке
   
       logs.forEach(log => {
           const tokenAddress = log.address.toLowerCase();
           if (!erc20Tokens.some(token => token.options.address === tokenAddress)) {
               const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
               erc20Tokens.push(tokenContract);
           }
       });
   
       const tokenBalances = [];     // для каждого токена в списке баланс в кошельке
   
       for (const token of erc20Tokens) {
           const balance = await token.methods.balanceOf(walletAddress).call();
           if (balance > 0) {
               const tokenAddress = token.options.address;
               const name = await token.methods.name().call();
               tokenBalances.push({
                   tokenAddress,
                   name,
                   balance
               });
           }
       }
   };
   //getTokenBalance();