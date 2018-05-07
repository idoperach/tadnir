import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import {HotModuleReplacementPlugin, optimize, NamedModulesPlugin} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

export default env => {
  const plugins = [
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      fileBlacklist: [
        /\.map/,
        /\.\/admin\.[a-f0-9]{20}\.js$/
      ]
    }),
    new optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new CompressionPlugin()
  ];

  let devtool = 'eval-source-map';

  if (env === 'production') {
    process.env.NODE_ENV = env;
    devtool = 'source-map';

    plugins.push(new MinifyPlugin());
    plugins.push(new optimize.ModuleConcatenationPlugin());
  }


  return {
    entry: {
      app: './client/index.js',
    },
    devtool,
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          loaders: ['style', 'css', 'less']
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(jp(e)?g|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '/[hash].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins
  }
};