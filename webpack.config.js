const webpack = require('webpack');

module.exports = {
    entry: './chromeExtension/js/react/main.js',
    output: {
        path: __dirname,
        filename: 'chromeExtension/js/build/bundle.js'
    },
    watch: true,
    context: __dirname,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
}
