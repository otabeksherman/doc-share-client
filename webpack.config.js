const path = require('path');
HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
      login: './src/index.js',
      home: './src/home.js',
      registration: './src/registration.js',
      doc: './src/doc.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/home.html',
        filename: 'home.html',
        chunks: ['home'],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/index.html',
        filename: 'index.html',
        chunks: ['login'],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/registration.html',
        filename: 'registration.html',
        chunks: ['registration'],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/doc.html',
        filename: 'doc.html',
        chunks: ['doc'],
      })
    ],
    mode: "development",
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    }
};

