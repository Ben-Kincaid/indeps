const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CSSModuleLoader = {
  loader: "css-loader",
  options: {
    modules: {
      mode: "local",
      localIdentName: "[name]_[local]_[hash:base64:5]",
      exportLocalsConvention: "camelCase"
    },
    importLoaders: 2
  }
};

const CSSLoader = {
  loader: "css-loader",
  options: {
    modules: {
      mode: "global",
      exportLocalsConvention: "camelCase"
    },
    importLoaders: 2
  }
};

const postCSSLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [["autoprefixer"]],
      sourceMap: false // turned off as causes delay
    }
  }
};

const sassLoader = {
  loader: "sass-loader",
  options: {
    sassOptions: {
      includePaths: [path.resolve(__dirname, "./client/")]
    }
  }
};
const isDev = process.env.NODE_ENV !== "production";
const styleLoader = isDev ? "style-loader" : MiniCssExtractPlugin.loader;

const config = {
  devtool: "inline-source-map",
  entry: path.resolve(__dirname, "./client/index.tsx"),
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              compact: true
            }
          }
        ],
        exclude: ["/node_modules/", "/lib/", "/src/"]
      },

      {
        test: /\.module\.(sc|c)ss$/,
        exclude: ["/node_modules/"],
        use: [styleLoader, CSSModuleLoader, postCSSLoader, sassLoader]
      },
      {
        test: /\.(sc|c)ss$/,
        exclude: ["/node_modules/", /\.module\.(sc|c)ss$/],
        use: [styleLoader, CSSLoader, postCSSLoader, sassLoader]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss"],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "./")
    ]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  }
};

if (isDev) {
  config.devServer = {
    hot: true,
    open: true,
    proxy: {
      "/": `http://localhost:8008`
    }
  };
}

module.exports = config;
