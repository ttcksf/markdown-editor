import * as React from 'react'
import {render} from 'react-dom'

const Main = (<h1>Markdown Editor</h1>)

//ReactとHTMLを繋ぐ処理。
//appというIDを持つHTML内の要素に対してMainという変数の内容を紐付ける処理をしている
render(Main, document.getElementById('app'))
