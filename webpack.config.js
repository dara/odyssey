const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    odyssey: [
      'babel-polyfill',
      './src/app.js'
    ],
  },
  target: 'web',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, './static'),
    compress: true,
    port: 9000
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      'static': path.resolve(__dirname, 'static'),
      'odyssey': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new ExtractTextPlugin('odyssey.[contenthash].css'),
  ],
  module: {
    rules: [
      { 
        test: /static\/.*/,
        use: `file-loader?context=static&name=[path][name].[hash].[ext]`
      },
      {
        test: /.s[ca]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: "css-loader" // translates CSS into CommonJS
            }, {
              loader: 'postcss-loader', // Run post css actions
              options: {
                plugins: () => { // post css plugins, can be exported to postcss.config.js
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            }, {
              loader: "sass-loader" // compiles Sass to CSS
            }
          ],
        })
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/, loader: 'source-map-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          cacheDirectory: true,
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ]
  }
}
