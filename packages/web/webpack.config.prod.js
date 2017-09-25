import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import pxtorem from 'postcss-pxtorem';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config.base';
import theme from './themes/theme';

export default webpackMerge(baseConfig, {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-redux',
      'react-redux',
      'redux',
      'redux-saga'
    ],
    index: [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
          ],
        }),
      },
      {
        test: /\.less$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'less-loader', options: { sourceMap: true, modifyVars: theme } }
          ]
        }),
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin([
      'dist'
    ]),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        postcss: () => ([
          pxtorem({
            rootValue: 100,
            propWhiteList: [],
          })
        ])
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   comments: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: true
    //   },
    //   compress: {
    //     drop_debugger: true,
    //     drop_console: true,
    //     screw_ie8: true
    //   },
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'resources/js/vendor-[hash:10].js'
    }),
    new ExtractTextPlugin({
      filename: 'resources/css/[name]-[hash:10].css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      __DEV__: false,
      __DEBUG__: false,
    }),
  ],
});
