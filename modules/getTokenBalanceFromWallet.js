const Web3 = require('web3');
const erc20Abi = require('human-standard-token-abi');
const { getTokensList } = require('./getTokensList');
const dotenv = require('dotenv');
dotenv.config();

const INFURA_URL = process.env.INFURA_URL
const INFURA_API_KEY = process.env.INFURA_API_KEY

const web3 = new Web3(new Web3.providers.HttpProvider(`${INFURA_URL}${INFURA_API_KEY}`));

async function getTokenBalanceFromWallet(walletAddress) {
    const tokenBalances = [];
    const promises = [];

    try {
        const tokenList = JSON.parse(JSON.stringify(await getTokensList()));
        const allTokens = tokenList.filter(token => token.platforms.ethereum && token.platforms.ethereum.toLowerCase() !== "0x0000000000000000000000000000000000000000")
            .map(token => ({
                name: token.name,
                address: token.platforms.ethereum
            }));

        const ethereumBalance = await web3.eth.getBalance(walletAddress);
        const ethereumBalanceInEther = web3.utils.fromWei(ethereumBalance, "ether");
        tokenBalances.push({
            name: "ETH",
            balance: ethereumBalanceInEther,
        });

        for (const token of allTokens) {
            const tokenContract = new web3.eth.Contract(erc20Abi, token.address);
            const p = tokenContract.methods.balanceOf(walletAddress).call()
                .then(tokenBalanceInWei => {
                    const tokenBalanceInEther = tokenBalanceInWei !== null ? web3.utils.fromWei(String(tokenBalanceInWei), "ether") : "0";
                    if (parseFloat(tokenBalanceInEther) > 0) {
                        tokenBalances.push({
                            name: token.name,
                            balance: tokenBalanceInEther,
                        });
                    }
                })
                .catch(err => {
                    console.log(`Error getting balance for token ${token.name}: ${err.message}`);
                });
            promises.push(p);
        }

        await Promise.all(promises);
        return tokenBalances;
    } catch (err) {
        console.error(`Error fetching API: ${err.message}`);
        throw err;
    }
};

module.exports = getTokenBalanceFromWallet;