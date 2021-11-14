const path = require("path");

const config = {
  entry: path.resolve(__dirname, "./client/index.tsx"),
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: ["/node_modules/", "/lib/", "/src/"],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  }
};

module.exports = config;
