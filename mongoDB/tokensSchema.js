const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  id: String,
  name: String,
  symbol: String,
  platforms: mongoose.Schema.Types.Mixed
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;