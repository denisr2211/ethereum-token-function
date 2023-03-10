const { saveTokenBalancesToFile }  = require('./modules/saveTokenBalancesToFile');
const dotenv = require('dotenv');

dotenv.config();

const walletAddress = process.env.WALLET_ADDRESS;

saveTokenBalancesToFile(walletAddress, 'tokenBalances.json');