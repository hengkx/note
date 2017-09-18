import webpack from 'webpack';
import path from 'path';
import webpackMerge from 'webpack-merge';
import pxtorem from 'postcss-pxtorem';
import ip from 'ip';
import baseConfig from './webpack.config.base';
import theme from './themes/theme';

const host = ip.address();
const port = 5001;

export default webpackMerge(baseConfig, {
  devtool: 'cheap-module-source-map',
  devServer: {
    host,
    port,
    hot: true,
    historyApiFallback: true,
    compress: true,
  },
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server',
    './src/index.js',
  ],
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.(js|jsx)$/,
      //   loader: 'eslint-loader',
      //   include: path.join(__dirname, 'src')
      // },
      {
        test: /\.css$/i,
        include: /node_modules/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.less/i,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { sourceMap: true, modifyVars: theme } }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => ([
          pxtorem({
            rootValue: 100,
            propWhiteList: [],
          })
        ])
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      __DEBUG__: false,
    }),
  ],
});
