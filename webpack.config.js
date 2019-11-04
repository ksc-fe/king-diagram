const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (p) => path.resolve(__dirname, p);

module.exports = {
    entry: resolve('src/js/index.js'),
    output: {
        path: resolve('./dist'),
    },
    resolve: {
        alias: {
            kpc: 'kpc/@stylus',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        }
                    }
                ]
            },
            {
                test: /\.vdt$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        }
                    },
                    {
                        loader: 'vdt-loader',
                        options: {
                            delimiters: ['{{', '}}'],
                        }
                    }
                ]
            },
            {
                test: /.styl$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            'include css': true,
                            'resolve url': true,
                            'import': '~kpc/styles/themes/ksyun/index.styl',
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
    ],
    devServer: {
        contentBase: [resolve('./dist'), resolve('./src')],
        compress: true,
        port: 9000
    },
};
