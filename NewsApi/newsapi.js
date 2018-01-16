var axios = require('axios');
let NEWS_API_KEY = 'bc94c1e9a8bf4049a98d573c1aa7c84b'
require('dotenv').config();

/* https://newsapi.org/s/crypto-coins-news-api */
let NEWS_API_KEY = 'bc94c1e9a8bf4049a98d573c1aa7c84b'
var CryptoNewsAPI = () => {
  return new Promise((resolve, reject) => {
    // axios.get(`https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=${process.env.NEWSAPI}`)
    axios.get(`https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=${NEWS_API_KEY}`)
      .then((response) => {
        response = response.data;
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.CryptoNewsAPI = CryptoNewsAPI;