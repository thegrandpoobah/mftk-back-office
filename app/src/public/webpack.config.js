var webpack = require("webpack")
var path = require("path")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var FaviconsWebpackPlugin = require("favicons-webpack-plugin")

module.exports = {
    entry: {
        app: "./scripts/main.js",
        vendor: [
            "jquery",
            "lodash",
            "aviator",
            "handlebars/runtime",
            "moment",
            "alpaca",
            "eonasdan-bootstrap-datetimepicker", 
            "modernizr"
            // "bootstrap-switch"
        ],
        bootstrap: ["bootstrap-loader/lib/bootstrap.loader?configFilePath="+__dirname+"/.bootstraprc!bootstrap-loader/no-op.js"]
    },
    output: {
        path: path.join(__dirname, '../../public'),
        publicPath: '/',
        filename: "scripts/app.[chunkhash].js"
    },
    module: {
        loaders: [
            { test: /\.handlebars$/, loader: "handlebars-loader" },
            { test: /\.modernizrrc$/, loader: "modernizr" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", ["css"]) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", ["css", "sass"]) },
            { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, loader: "url-loader?limit=8196&name=fonts/[hash].[ext]" },
            { 
                test: require.resolve('alpaca/dist/alpaca/bootstrap/alpaca'),
                loader: 'script!imports?this=>{umd:false%2CjQuery:jQuery%2CHandlebars:Handlebars}',
            },
            { test: require.resolve('handlebars/runtime'), loader: 'expose?Handlebars' },
            { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
            { test: require.resolve('moment'), loader: 'expose?moment' }
        ]
    },
    resolve: {
      alias: {
        'jquery': path.resolve(path.join(__dirname, '../..', 'node_modules', 'jquery')),
        alpaca: 'alpaca/dist/alpaca/bootstrap/alpaca',
        modernizr$: path.join(__dirname, ".modernizrrc")
      }
    },
    //devtool: 'source-map',
    plugins: [
        // new webpack.ProvidePlugin({
        //     "window.moment": "moment"
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({ names: ["bootstrap", "vendor"], filename: "scripts/[name].[chunkhash].js" }),
        new ExtractTextPlugin("styles/[name].[chunkhash].css"),
        new FaviconsWebpackPlugin("./favicon.png"),
        new HtmlWebpackPlugin({
            template: "index.html.handlebars"
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) 
    ]
};
