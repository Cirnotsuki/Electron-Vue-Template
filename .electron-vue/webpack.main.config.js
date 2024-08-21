'use strict';

process.env.BABEL_ENV = 'main';

const path = require('path');
const { dependencies } = require('../package.json');
const webpack = require('webpack');

const MinifyPlugin = require('babel-minify-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

let mainConfig = {
    entry: {
        renderer: path.join(__dirname, '../src/main/index.js')
    },
    externals: [ ...Object.keys(dependencies || {}) ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: path.resolve(__dirname, '../src/renderer/utils/loader.js')
            }
        ]
    },
    node: {
        __dirname: devMode,
        __filename: devMode
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist')
    },
    plugins: [ new webpack.NoEmitOnErrorsPlugin() ],
    resolve: {
        extensions: [ '.js', '.json', '.node' ]
    },
    target: 'electron-main',
    optimization: {
        minimize: true,
        minimizer: []
    }
};

/**
 * Adjust mainConfig for development settings
 */
if (devMode) {
    mainConfig.plugins.push(
        new webpack.DefinePlugin({
            __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
            __dat: `"${path.join(__dirname, '../dat').replace(/\\/g, '\\\\')}"`
        })
    );
}

/**
 * Adjust mainConfig for production settings
 */
if (!devMode) {
    mainConfig.plugins.push(
        new MinifyPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    );

    mainConfig.optimization.minimizer.push(new TerserPlugin({
        terserOptions: {
            output: {
                comments: false,
                beautify: false
            },
            compress: {
                drop_console: false
            }
        },
        extractComments: false
    }));
}

module.exports = mainConfig;
