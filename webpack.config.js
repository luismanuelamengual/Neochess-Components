const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: [
        './src/index.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Neochess components',
            meta: {
                viewport: 'width=device-width, initial-scale=1'
            }
        })
    ]
    /*,
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        contentBase: './www'
    },
    mode: "development"*/
};
