const supportedCoins = {
  EOS: {
    min: 0.1,
    order: 10,
    icon: require('~/assets/images/coins/eos.png')
  },
  ETH: {
    min: 0.001,
    order: 15,
    icon: require('~/assets/images/coins/eth.png')
  },
  XIN: {
    min: 0.001,
    order: 20,
    icon: require('~/assets/images/coins/xin.png')
  },
  BTC: {
    min: 0.0001,
    order: 25,
    icon: require('~/assets/images/coins/btc.png')
  },
  DICEOS: {
    min: 0.01,
    order: 26,
    icon: require('~/assets/images/coins/diceos.png')
  },
  DOGE: {
    min: 10,
    order: 30,
    icon: require('~/assets/images/coins/doge.png')
  },
  ZEN: {
    min: 0.01,
    order: 40,
    icon: require('~/assets/images/coins/zen.png')
  },
  DASH: {
    min: 0.001,
    order: 50,
    icon: require('~/assets/images/coins/dash.png')
  },
  CANDY: {
    min: 1000,
    order: 60,
    icon: require('~/assets/images/coins/candy.png')
  },
  CNB: {
    min: 1000,
    order: 70,
    icon: require('~/assets/images/coins/cnb.png')
  }
}
export default {
  methods: {
    assetCoinMin(symbol) {
      if (supportedCoins.hasOwnProperty(symbol)) {
        return supportedCoins[symbol].min
      }
      return 100
    },
    assetCoinIcon(symbol) {
      if (supportedCoins.hasOwnProperty(symbol)) {
        return supportedCoins[symbol].icon
      }
      return ''
    },
    stripeNumber (x, n) {
      if (x.constructor === String) {
        let dotPos = x.indexOf('.')
        if (dotPos !== -1) {
          x = x.substring(0, dotPos + n + 1)
        }
        return x
      } else if (x.constructor === Number) {
        return x.toFixed(n)
      } else {
        return x
      }
    },
    assetCoinProp(symbol, prop, defaultValue=null) {
      if (supportedCoins.hasOwnProperty(symbol)) {
        if (supportedCoins[symbol].hasOwnProperty(prop)) {
          return supportedCoins[symbol][prop]
        }
        return defaultValue
      }
      return defaultValue
    }
  }
}