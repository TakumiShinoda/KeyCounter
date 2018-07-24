var ExtractTextPlugin = require('extract-text-webpack-plugin');
const {srcPath, distPath} = require('./path');

module.exports = {
  config: (routes) => {
    return {
      entry: srcPath.entries("/" + routes + ".entry.js"),
      output: {
        filename: routes + ".js"
      },
      module: {
        loaders: [
          {
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css-loader'),
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin('/style.css'),
      ]
    };
  }
}
