const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const outputDirectory = "dist";

module.exports = {
  devtool: "",
  mode: isProduction ? "production" : "development",
  entry: {
    index: [path.resolve(__dirname, "./src/index.js")],
  },
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: isProduction ? "[name].[hash].js" : "[name].js",
    chunkFilename: isProduction ? "[id].[hash].js" : "[id].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
  devtool: isProduction ? "" : "inline-source-map",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/template/index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
};
