const path = require('path');
HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
      login: './src/index.js',
      doc: './src/doc.js',
      register: './src/register.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/doc.html',
        filename: 'doc.html',
        chunks: ['doc'],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/index.html',
        filename: 'index.html',
        chunks: ['login-page'],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: './dist/register.html',
        filename: 'register.html',
        chunks: ['register-page'],
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

