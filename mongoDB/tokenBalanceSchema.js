const mongoose = require('mongoose');

const tokenBalanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    balance: {
        type: String,
        required: true,
    },
});

const TokenBalance = mongoose.model('TokenBalance', tokenBalanceSchema);

module.exports = {
    TokenBalance
};