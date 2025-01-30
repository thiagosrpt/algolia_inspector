const path = require("path");

module.exports = {
  mode: "development", // Use "production" for production builds
  entry: "./panel/index.js", // Update this if your React entry point is elsewhere
  output: {
    path: path.resolve(__dirname, "panel/dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: "source-map",
};
