const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const yargs = require('yargs');
const isProductionBuild = yargs.argv.mode === 'production';

const plugins = [];
plugins.push(new CleanWebpackPlugin());
if (!isProductionBuild) {
    plugins.push(new HtmlWebpackPlugin({
        template: 'www/index.html'
    }));
}

module.exports = {
    mode: 'production',
    entry: [
        './src/index.ts'
    ],
    output: {
        path: __dirname + '/dist',
        filename: 'neochess-components.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                type: 'asset/inline'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    plugins: plugins
};

if (!isProductionBuild) {
    module.exports.mode = 'development';
    module.exports.devtool = 'inline-source-map';
    module.exports.devServer = {
        open: true,
        contentBase: './dist',
        port: 8080
    }
}
