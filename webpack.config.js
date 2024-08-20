const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProd = process.env.IS_PROD === 'true';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: isProd ? './' : '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
      'process.env.IS_PROD': JSON.stringify(isProd),
    }),
  ].filter(Boolean),
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080,
    historyApiFallback: true,
  },
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
};
