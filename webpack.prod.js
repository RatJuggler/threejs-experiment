const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = env => {

    let generating = 'Generating: ';
    if (!env || !env.generate || !['dist', 'docs'].includes(env.generate)) {
        env = {
            'generate': 'dist'
        };
        generating = 'Generate not defined, defaulting to: ';
    }
    console.log(generating + env.generate);

    return {
        // This option controls if and how source maps are generated.
        // https://webpack.js.org/configuration/devtool/
        devtool: 'source-map',

        // https://webpack.js.org/concepts/entry-points/#multi-page-application
        entry: {
            index: './src/js/index.js'
        },

        // how to write the compiled files to disk
        // https://webpack.js.org/concepts/output/
        output: {
            filename: env.generate === 'dist' ? '[name].[hash:20].js': '[name].js',
            path: path.resolve(__dirname, env.generate)
        },

        // https://webpack.js.org/concepts/loaders/
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                }
            ]
        },

        // https://webpack.js.org/concepts/plugins/
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/template.html',
                inject: true,
                filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: env.generate === 'dist' ? '[name].[contenthash].css': '[name].css',
                chunkFilename: env.generate === 'dist' ? '[id].[contenthash].css': '[id].css'
            })
        ],

        // https://webpack.js.org/configuration/optimization/
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        ecma: 6
                    }
                })
            ]
        }
    };
};
