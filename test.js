const axios = require('axios');
const ABI = require('human-standard-token-abi');
const Web3 = require('web3');
const fs = require('fs');

const walletAddress = '0xA145ac099E3d2e9781C9c848249E2e6b256b030D';
const apiKey = 'MNJDWMB87WR2GN5G6IN5GM45BB1IHVEIRB';
const etherscanUrl = `https://api.etherscan.io/api`;
const balancesFilePath = './erc20Balances.json';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/64a2626b0570450fb688d9f7c0866316'));
//const web3 = new Web3(new Web3.providers.HttpProvider('https://speedy-nodes-nyc.moralis.io/64a2626b0570450fb688d9f7c0866316/eth/mainnet'));
//const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/64a2626b0570450fb688d9f7c0866316'));

axios.get(`${etherscanUrl}?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=999999999&sort=asc&apikey=${apiKey}`)
    .then(function (response) {
        if (response.data.result && Array.isArray(response.data.result)) {

            const balances = {};

            response.data.result.forEach(function (tx) {
                const tokenContract = new web3.eth.Contract(ABI, tx.contractAddress);
                tokenContract.methods.totalSupply().call()
                    .then(function (totalSupply) {

                        if (totalSupply > 0) {
                            tokenContract.methods.balanceOf(walletAddress).call()
                                .then(function (balance) {
                                    if (balance > 0) {
                                        const balanceInEther = web3.utils.fromWei(String(balance), "ether");
                                        console.log(`Balance of token ${tx.tokenName} (${tx.tokenSymbol}) on address ${walletAddress} is ${balanceInEther}`);
                                        balances[tx.tokenSymbol] = balanceInEther;
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
       fs.writeFile(balancesFilePath, JSON.stringify(balances), function (err) {
        if (err) throw err;
        console.log(`Balances saved to ${balancesFilePath}`);
    });
} else {
    console.log(`Unexpected API response: ${JSON.stringify(response.data)}`);
}
    })
    .catch(function (error) {
        console.log(error);
    });