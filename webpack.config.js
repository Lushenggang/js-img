
const merge = require('webpack-merge')

const configPath = process.env.NODE_ENV === 'production' ? './webpack.prod.js' : './webpack.dev.js'
const customConfig = require(configPath)

module.exports = merge({
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  }
}, customConfig)