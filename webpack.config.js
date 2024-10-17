const path = require('path');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
        fallback: {
            "fs": false,
            "path": false,
            "os": false,
            "http": false,
            "https": false,
            "crypto": false,
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
