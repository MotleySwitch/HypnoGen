const webpack = require("webpack")
const path = require("path")

module.exports = {
    mode: "development",
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "docs"),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: [{
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    }
                }, "babel-loader"],
                exclude: /node_modules/
            }
        ]
    },
    experiments: {
        syncWebAssembly: true
    },
    plugins: [
        new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
        new webpack.HotModuleReplacementPlugin()
    ]
}
