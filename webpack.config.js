require('dotenv').config();
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// React 관련 설정
const reactConfig = {
  mode: 'production',
  entry: {
    sidepanel: './src/sidepanel.tsx',
    background: './src/background.ts',
    content: './src/content.ts',
    newtab: './src/newtab.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                noEmit: false,
                jsx: 'react-jsx'
              }
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_DEV_SERVER': JSON.stringify(process.env.REACT_APP_DEV_SERVER)
    }),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "public/icons", to: "icons" }
      ],
    }),
  ],
  devtool: false,
};

// Non-React 설정 (background, content)
const nonReactConfig = {
  mode: 'production',
  entry: {
    background: './src/background.ts',
    content: './src/content.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    iife: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                noEmit: false,
                module: 'ESNext',
                target: 'ES2020'
              }
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_DEV_SERVER': JSON.stringify(process.env.REACT_APP_DEV_SERVER)
    }),  
    new CopyPlugin({
      patterns: [
        { from: 'public' }
      ],
    }),
  ],
  devtool: false,
  optimization: {
    minimize: false
  }
};

module.exports = [reactConfig, nonReactConfig]; 