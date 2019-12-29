const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI
//const URI = "mongodb://localhost/api-market"

mongoose.connect(URI, { useNewUrlParser: true })
  .then(db => console.log('DB esta conectada'))
  .catch(err => console.error(err));

module.exports = mongoose;