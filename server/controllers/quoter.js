var quotes = require('../models/quotes.json');

exports.getRandomOne = function() {
  var totalAmount = quotes.length;
  var rand = Math.ceil(Math.random() * totalAmount);
  return quotes[rand];
}
