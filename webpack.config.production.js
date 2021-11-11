const webpack = require("webpack")
const path = require("path")

module.exports = {
    mode: "production",
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "docs"),
        publicPath: "/HypnoGen/"
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
        new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] })
    ]
}
