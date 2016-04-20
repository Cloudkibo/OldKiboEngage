var    quoter  = require('./quoter');



exports.randomQuote = function(req, res) {
  res.status(200).send(quoter.getRandomOne());
};
