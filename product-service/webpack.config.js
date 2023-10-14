const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: __dirname,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-typescript"], ["@babel/preset-env"]],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".mjs", ".json", ".ts", ".js"],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name].js",
  },
};
