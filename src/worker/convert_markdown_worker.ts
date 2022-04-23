//ライブラリをインポート
import * as marked from 'marked'
import * as sanitizeHtml from 'sanitize-html'
//通常のJavaScriptだとselfがグローバル変数にできるが、TypeScriptは型定義の兼ね合いでビルドできないことがあるためanyとする
//workerという変数はWorkerという型だと定義しておく
const worker: Worker = self as any

//メインデータが来たら関数を実行する。dataというパラメーターがメインスレッドから渡された値になる
worker.addEventListener('message', (event) => {
  const text = event.data
  //marked関数でHTMLに変換して変数htmlに返す
  const html = sanitizeHtml(marked(text), {allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2']})
  worker.postMessage({html})
})
