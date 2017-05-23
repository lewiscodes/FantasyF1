var webpack = require('webpack');

module.exports = {
  entry: [
    'whatwg-fetch',
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './client/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
