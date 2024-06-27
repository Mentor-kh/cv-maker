/* eslint-disable */
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "net": false,
            "tls": false,
            "crypto": false,
            "https": false,
            "http": require.resolve("stream-http")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            buffer: require.resolve("buffer"),
        }),
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
            const mod = resource.request.replace(/^node:/, "");
            switch (mod) {
                case "buffer":
                    resource.request = "buffer";
                    break;
                case "stream":
                    resource.request = "readable-stream";
                    break;
                default:
                    throw new Error(`Not found ${mod}`);
            }
        }),
        // new NodePolyfillPlugin()
    ],
    // externals: [nodeExternals()],
};
