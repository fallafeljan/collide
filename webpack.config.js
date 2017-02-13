const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const debug = process.env.NODE_ENV !== 'production'

const config = {
  entry: `${__dirname}/app/index.js`,
  output: {
    path: `${__dirname}/public`,
    filename: debug ? 'bundle.js' : 'bundle.[hash].js'
  },

  devtool: debug ? 'source-map' : false,

  performance: {
    hints: debug ? false : 'warning'
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.(glsl|vs|fs)$/,
      use: 'raw-loader'
    }]
  },

  devServer: {
    contentBase: `${__dirname}/public`,
    port: 3000
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: !debug,
      debug
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),

    new HtmlWebpackPlugin({
      inject: 'body',
      template: `${__dirname}/index.html`
    }),

  ]
}

module.exports = config
