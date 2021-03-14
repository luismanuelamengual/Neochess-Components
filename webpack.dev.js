const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { merge } = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        contentBase: './dist',
        port: 8080
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'www/index.html'
        })
    ]
});
