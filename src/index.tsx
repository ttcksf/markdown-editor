import * as React from 'react'
import {render} from 'react-dom'
import styled from 'styled-components'
import {createGlobalStyle} from 'styled-components'
import {
  //HashRouterをRouterという名前で使う
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
//エディタ画面をインポートして表示するための記述
import {Editor} from './pages/editor'
import {History} from './pages/history'
import { useStateWithStorage } from './hooks/use_state_with_storage'

//styled.(HTMLタグ名)で生成したいHTMLタグを指定して、``内にCSSを記述すると、そのコンポーネントにスタイルが適用される

//styled-componentsのcreateGlobalStyleを使って、ページ全体に適用できるスタイルを定義
const GlobalStyle = createGlobalStyle`
  body * {
    box-sizing: border-box;
  }
`
const StorageKey = '/editor:text'

//useStateを使うためにMainを関数にする
const Main: React.FC = () => {
  const [text, setText] = useStateWithStorage('', StorageKey)

  return (
    <>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path="/editor">
            <Editor
              text={text}
              setText={setText}
            />
          </Route>
          <Route exact path="/history">
            <History
              setText={setText}
            />
          </Route>
          <Redirect to="/editor" path="*" />
        </Switch>
      </Router>
    </>
  )
}

render(<Main />, document.getElementById('app'))
