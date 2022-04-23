const path = require('path')

module.exports = {
  //最初に読み込むファイル
  entry: './src/index.tsx',
  //rulesでwebpackに対してビルド時に追加で行う処理を設定
  //.tsで終わるファイルに対して、ts-loaderを実行する、というような意味を持つ
  //excludeは除外するファイルを正規表現で書く
  //resolveはモジュールとして解決するファイルの拡張子を.tsとして指定
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['','.js','.ts','.tsx'],
  },
  //webpack.config.jsの置いてあるディレクトリにあるdistというディレクトリに対して、ファイル名をindex.jsで出力する。
  //変換する際にはJavaScript内に書かれている相対パスのリソースへ自動的にdist/を追加する
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: 'dist/',
  },
  devServer: {
    publicPath: '/dist/',
    hot: true,
    open: true,
  }
}
