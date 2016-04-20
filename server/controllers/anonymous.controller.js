var quoter  = require('./quoter');

exports.anonymousQuote =  function(req, res) {
  res.status(200).send(quoter.getRandomOne());
};
