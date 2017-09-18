import path from 'path';
import webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';

export default {
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'resources/js/[name]-[hash:10].js',
    chunkFilename: 'resources/js/[name]-[chunkhash:10].js',
  },
  resolve: {
    alias: {
      rework: 'rework.less/rework.less'
    },
    extensions: [
      '.web.js',
      '.jsx',
      '.js',
      '.less',
      '.css',
      '.json',
    ],
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/i,
        use: [
          'svg-sprite-loader?name=[name]-[hash:10]',
          `image-webpack-loader?${JSON.stringify({
            svgo: {
              plugins: [
                { cleanupAttrs: true },
                { cleanupEnableBackground: true },
                { cleanupIDs: true },
                { removeRasterImages: true },
                { removeDimensions: true },
                { removeStyleElement: true },
              ]
            }
          })}`
        ]
      },
      {
        test: /\.(png|jpe?g|gif)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'resources/images/[name]-[hash:10].[ext]',
              limit: 5000
            }
          },
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      inject: true,
      template: './src/index.ejs',
      title: 'Api Doc',
      minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};
