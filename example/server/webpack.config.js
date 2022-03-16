const path = require("path");

module.exports = {
    entry: './server.jsx',
    target: 'node',
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-react']
                    }
                  }
            }
        ]
    }
}
