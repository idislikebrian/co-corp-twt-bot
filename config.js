const dotenv = require ( 'dotenv' )

dotenv.config()
//fill in your Twitter API credentials below
const config = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }
  
  module.exports = config;