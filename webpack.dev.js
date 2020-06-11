const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    // This option controls if and how source maps are generated.
    // https://webpack.js.org/configuration/devtool/
    devtool: 'eval-cheap-module-source-map',

    // https://webpack.js.org/concepts/entry-points/#multi-page-application
    entry: {
        index: './src/js/index.js'
    },

    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        port: 8080,
        writeToDisk: false
    },

    // https://webpack.js.org/concepts/loaders/
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    // https://webpack.js.org/concepts/plugins/
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        })
    ]
};
