const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

/* settings */
const pages = ['index', 'index2']; // + in main.js for watcher
const port = 3010;
const mode = process.env.NODE_ENV;

module.exports =  {
  context: path.resolve(__dirname, 'src'),
  entry: './js/main.js',
  mode: mode,
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    client: {
      overlay: true,
      progress: true,
    },
    port: port,
    open: true,
    compress: true,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './js/main.js',
  },
  target: 'web',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    //aggregateTimeout: 200,
    //poll: 1000,
  },
  module: {
    rules: [
      /** Babel **/
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      /** CSS */
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      /** SCSS/SASS */
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      /** Images */
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      /** Fonts */
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      /** TWIG */
      {
        test: /\.twig$/,
        use: [
          'raw-loader',
          'twig-html-loader'
        ]
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // remove comments
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      // compress SVG, create webp and avif
      new ImageMinimizerPlugin({
        test: /\.(svg|jpe?g|png)$/i,
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["imagemin-mozjpeg",
                {
                  quality: 90,
                }
              ],
              "imagemin-pngquant",
              [
                "svgo",
                {
                  plugins: extendDefaultPlugins([
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                    {
                      name: "addAttributesToSVGElement",
                      params: {
                        attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                      },
                    },
                  ]),
                },
              ],
            ],
          },
        },
        deleteOriginalAssets: false,
        generator: [
          {
            type: "asset",
            preset: "webp",
            //filename: "[name][ext]",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },

        ],
      }),
    ],
  },
  plugins: [].concat(
    // clear dist folder
    new CleanWebpackPlugin(),
    // convert twig templates to html
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./${page}.twig`,
          filename: `${page}.html`,
          chunks: [page],
        })
    ),
    // min css
    new MiniCssExtractPlugin({
      filename: './css/style.css'
    }),
    // copy images
    new CopyPlugin({
      patterns: ['img/**/*']
    }),

    // example for do something only in production mode:
    //mode == 'production' ? new... : [],
  ),
};