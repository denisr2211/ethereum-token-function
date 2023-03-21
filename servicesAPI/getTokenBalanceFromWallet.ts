import Web3 from 'web3';
import erc20Abi from 'human-standard-token-abi';
import dotenv from 'dotenv';
import Token from '../interface/InterfaceToken';
import TokenBal from '../interface/InterfaceTokenBal';
import AllTokens from '../interface/interfaceAllTokens';
dotenv.config();

const INFURA_URL: string | undefined = process.env.INFURA_URL
const INFURA_API_KEY: string | undefined = process.env.INFURA_API_KEY

const web3 = new Web3(new Web3.providers.HttpProvider(`${INFURA_URL}${INFURA_API_KEY}`));

async function getTokenBalanceFromWallet(walletAddress: string, tokenList: Array<Token>): Promise<Array<TokenBal>> {

    const tokenBalances: Array<TokenBal> = [];
    const promises: Array<Promise<void>> = [];

    try {
        const allTokens: Array<AllTokens> = tokenList.filter(token => token.platforms.ethereum && token.platforms.ethereum.toLowerCase() !== "0x0000000000000000000000000000000000000000")
            .map(token => ({
                name: token.name,
                address: token.platforms.ethereum
            }));

        const ethereumBalance: string = await web3.eth.getBalance(walletAddress);
        const ethereumBalanceInEther: string = web3.utils.fromWei(ethereumBalance, "ether");
        tokenBalances.push({
            name: "ETH",
            balance: ethereumBalanceInEther,
        });

        for (const token of allTokens) {
            const tokenContract: any = new web3.eth.Contract(erc20Abi, token.address);
            const p: any = tokenContract.methods.balanceOf(walletAddress).call()
                .then((tokenBalanceInWei: number) => {
                    const tokenBalanceInEther: string = tokenBalanceInWei !== null ? web3.utils.fromWei(String(tokenBalanceInWei), "ether") : "0";
                    if (parseFloat(tokenBalanceInEther) > 0) {
                        tokenBalances.push({
                            name: token.name,
                            balance: tokenBalanceInEther,
                        });
                    }
                })
                .catch((err: { message: any; }) => {
                    console.log(`Error getting balance for token ${token.name}: ${err.message}`);
                });
            promises.push(p);
        }

        await Promise.all(promises);

        if (tokenBalances.length === 0) {
            console.warn('No token balances found.');
        }

        return tokenBalances;
    } catch (err: any) {
        console.error(`Error fetching API: ${err.message}`);
        throw err;
    }
};

export default getTokenBalanceFromWallet;