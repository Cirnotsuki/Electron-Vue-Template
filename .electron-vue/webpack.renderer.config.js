'use strict';

process.env.BABEL_ENV = 'renderer';

const path = require('path');
const { dependencies, name } = require('../package.json');
const webpack = require('webpack');

const MinifyPlugin = require('babel-minify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');


const devMode = process.env.NODE_ENV !== 'production';

function recursiveIssuer (m, c){
    const issuer = m.issuer;

    if (issuer) {
        return recursiveIssuer(issuer, c);
    }

    const chunks = m._chunks;

    for (const chunk of chunks) {
        return chunk.name;
    }

    return false;
}

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = [ 'vue' ];
let rendererConfig = {
    devtool: '#cheap-module-eval-source-map',
    entry: {
        renderer: path.join(__dirname, '../src/renderer/main.js'),
    },
    externals: [ ...Object.keys(dependencies || {}).filter((d) => !whiteListedModules.includes(d)) ],
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [ devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader' ]
            },
            {
                test: /\.css$/,
                use: [ devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: !devMode,
                        loaders: {
                            less: devMode
                                ? 'vue-style-loader!css-loader!less-loader'
                                : [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader' ]
                        }
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 1024000,
                        name: 'imgs/[name]--[folder].[ext]'
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name]--[folder].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name]--[folder].[ext]'
                    }
                }
            }
        ]
    },
    node: {
        __dirname: devMode,
        __filename: devMode
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),

        // 工程列表主页面
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            chunks: ['renderer', 'runtime', 'vue', 'vueRouter', 'cssStyle', 'vendor', 'common'],
            templateParameters (compilation, assets, options) {
                return {
                    compilation: compilation,
                    webpack: compilation.getStats().toJson(),
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: options
                    },
                    process
                };
            },
            showErrors: devMode,
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: devMode ? path.resolve(__dirname, '../node_modules') : false
        }),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist')
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/renderer'),
            static: path.resolve(__dirname, '../static'),
            root: path.resolve(__dirname, '../'),
            vue$: path.resolve(__dirname, '../src/renderer/modules/vue/index.js')
        },
        extensions: [ '.js', '.vue', '.json', '.css', '.node' ]
    },
    target: 'electron-renderer',
    optimization: {
        minimize: true,
        minimizer: [],
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            chunks: 'all',
            minSize: 0,

            cacheGroups: {
                default: false,
                vendors: false,
                
                vue: {
                    test: /[\\/]modules[\\/]vue[\\/]index.js/,
                    name: 'vue',
                    enforce: true,
                    chunks: 'all',
                    priority: 50
                },
                vueRouter: {
                    test: /[\\/]modules[\\/]vue-router[\\/]index.js/,
                    name: 'vueRouter',
                    enforce: true,
                    chunks: 'all',
                    priority: 50
                },
                styles: {
                    name: 'cssStyle',
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                    priority: 10
                },

                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'initial',
                    priority: 20
                },

                common: {
                    name: 'common',
                    enforce: true,
                    chunks: 'all',
                    priority: 1,
                    minChunks: 2,
                },
            }
        }
    }
};

/**
 * Adjust rendererConfig for development settings
 */
if (devMode) {
    rendererConfig.plugins.push(
        new webpack.DefinePlugin({
            __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
            __dat: `"${path.join(__dirname, '../dat').replace(/\\/g, '\\\\')}"`
        })
    );
}

/**
 * Adjust rendererConfig for production settings
 */
if (!devMode) {
    rendererConfig.devtool = '';

    rendererConfig.plugins.push(
        new MinifyPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../static'),
                to: path.join(__dirname, '../dist/static'),
                ignore: [ '.*' ]
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    );

    rendererConfig.optimization.minimizer.push(
        new TerserPlugin({
            terserOptions: {
                output: {
                    comments: false,
                    beautify: false
                },
                compress: {
                    drop_console: true
                }
            },
            extractComments: false
        })
    );
}

rendererConfig.plugins.push(
    new CopyWebpackPlugin([
        {
            from: path.join(__dirname, '../static'),
            to: path.join(__dirname, '../dist/electron/static'),
            ignore: ['.*']
        }
    ])
);

module.exports = rendererConfig;
