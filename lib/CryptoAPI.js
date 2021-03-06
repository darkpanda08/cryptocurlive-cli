const axios = require('axios')
const colors = require('colors')
const checkInternetConnected = require('check-internet-connected');

class CryptoAPI {
    constructor(apiKey) {
        this.apiKey = apiKey
        this.baseUrl = 'https://api.nomics.com/v1/currencies/ticker'
    }

    async getPriceData(coinOption, curOption) {
        try {
            await checkConnection()
                .catch(() => {
                    throw new CustomException('Exception message', {});
                });
            // Formatter for Currency
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: curOption
            })

            const res = await axios.get(`${this.baseUrl}?key=${this.apiKey}&ids=${coinOption}&convert=${curOption}`)

            let output = ''
            res.data.forEach(coin => {
                output += `Coin: ${coin.symbol.yellow} (${coin.name}) | Price: ${formatter.format(coin.price).green} | Rank: ${coin.rank.blue}\n`
            });

            return output
        } catch (err) {
            handleAPIError(err)
        }
    }
}

function CustomException(message, metadata) {
    const error = new Error(message);
    const response = {
        error,
        response: {
            status: 502,
            message: 'No internet. Try checking the network cables, modem, and router'
        }
    }
    return response;
  }

checkConnection = async () => {
    return checkInternetConnected();
}

function handleAPIError(err) {
    if(err.response.status === 401) {
        throw new Error('Your API Key is invalid - Get one from https://nomics.com')
    } else if(err.response.status === 404) {
        throw new Error('The API is not responding. Please try again later')
    } else if(err.response.status === 502) {
        throw new Error(err.response.message)
    } else {
        throw new Error('Something is not working')
    }
}

module.exports = CryptoAPI