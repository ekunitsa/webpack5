const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const webpack = require('webpack');

/* settings */
const settings = {
    pages: ['index', 'index2'], // + in main.js for watcher
    port: 3010,
    mode: process.env.NODE_ENV,
    sprite: {
        active: true,
        input: ['./src/img/svg-sprite/**/*.svg'],
        output: 'img/sprite.svg'
    }
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    mode: settings.mode,
    devtool: 'cheap-module-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        client: {
            overlay: true,
            progress: true
        },
        port: settings.port,
        open: true,
        compress: true
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: './js/main.js'
    },
    target: 'web',
    watch: true,
    watchOptions: {
        ignored: /node_modules/
        // aggregateTimeout: 200,
        // poll: 1000,
    },
    module: {
        rules: [
            // Babel
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
            // CSS
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            /** SCSS/SASS */
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: 'compressed',
                                silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import', 'mixed-decls']
                            }
                        }
                    }
                ]
            },
            /** Images */
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                // images from sass
                generator: {
                    filename: 'img/inscss/[name].[hash][ext]'
                }
            },
            /** Fonts */
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            /** TWIG */
            {
                test: /\.twig$/,
                use: ['raw-loader', 'twig-html-loader']
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            // remove comments
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            // create webp and avif automatically for html\twig
            new ImageMinimizerPlugin({
                test: /\.(jpe?g|png)$/i,
                deleteOriginalAssets: false,
                generator: [
                    {
                        type: 'asset',
                        preset: 'webp',
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: [
                                [
                                    'imagemin-webp',
                                    {
                                        quality: 90
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        type: 'asset',
                        preset: 'avif',
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: ['imagemin-avif']
                        }
                    }
                ]
            }),
            // compress SVG, jpeg and png
            new ImageMinimizerPlugin({
                test: /\.(svg|jpe?g|png)$/i,
                deleteOriginalAssets: false,
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            [
                                'imagemin-mozjpeg',
                                {
                                    quality: 90
                                }
                            ],
                            'imagemin-pngquant',
                            [
                                'svgo',
                                {
                                    plugins: extendDefaultPlugins([
                                        {
                                            name: 'removeViewBox',
                                            active: false
                                        },
                                        {
                                            name: 'addAttributesToSVGElement',
                                            params: {
                                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
                                            }
                                        }
                                    ])
                                }
                            ]
                        ]
                    }
                }
            }),
            // create webp and avif with "as..." params (for sass\css)
            new ImageMinimizerPlugin({
                test: /\.(jpe?g|png)$/i,
                deleteOriginalAssets: false,
                generator: [
                    {
                        type: 'import',
                        preset: 'webp',
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: [
                                [
                                    'imagemin-webp',
                                    {
                                        quality: 90
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        type: 'import',
                        preset: 'avif',
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: ['imagemin-avif']
                        }
                    }
                ]
            })
        ]
    },
    plugins: [].concat(
        // add jq
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // clear dist folder
        new CleanWebpackPlugin(),
        // convert twig templates to html
        settings.pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./${page}.twig`,
                    filename: `${page}.html`,
                    chunks: [page]
                })
        ),
        // svg sprite generate
        settings.sprite.active === true
            ? new SVGSpritemapPlugin(settings.sprite.input, {
                  output: {
                      filename: settings.sprite.output
                  },
                  sprite: {
                      prefix: ''
                  }
              })
            : [],
        // min css
        new MiniCssExtractPlugin({
            filename: './css/style.css'
        }),
        // copy images
        new CopyPlugin({
            patterns: ['img/**/*']
        })

        // example for do something only in production mode:
        // settings.mode == 'production' ? new... : [],
    )
};
