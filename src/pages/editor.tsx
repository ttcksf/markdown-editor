import * as React from 'react'
import styled from 'styled-components'
import { useStateWithStorage } from '../hooks/use_state_with_storage'
import * as ReactMarkdown from 'react-markdown'
import {putMemo} from '../indexeddb/memos'
import {Button} from '../components/button'
import { SaveModal } from '../components/save_modal'
import {Link} from 'react-router-dom'
import {Header} from '../components/header'
import ConvertMarkdownWorker from 'worker-loader!../worker/convert_markdown_worker'
import { textChangeRangeIsUnchanged } from 'typescript'
//Workerｍのインスタンスを生成
const convertMarkdownWorker = new ConvertMarkdownWorker()
const {useState, useEffect} = React

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
`

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`

const TextArea = styled.textarea`
  border-right: 1px solid silver;
  border-top: 1px solid silver;
  bottom: 0;
  font-size: 1rem;
  left: 0;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  width: 50vw;
`

const Preview = styled.div`
  border-top: 1px solid silver;
  bottom: 0;
  overflow-y: scroll;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  width: 50vw;
`


interface Props {
  text: string
  setText: (text: string) => void
}
//React.FCはReactのコンポーネントを返す関数コンポーネント。JSXで<Editor></Editor>という形式で呼び出す
export const Editor: React.FC<Props> = (props) => {
  const {text, setText} = props
  //モーダルを表示するかどうか。trueで表示、falseで非表示
  const [showModal, setShowModal] = useState(false)
  //HTMLの文字列を管理する状態を用意
  const [html, setHtml] = useState('')


  //useEffectを使って初回のみWorkerから結果を受け取る関数を登録しておく
  useEffect(() => {
    convertMarkdownWorker.onmessage = (event) => {
      setHtml(event.data.html)
    }
    },[])
  //useEffectを使ってテキストの変更時にWorkerへテキストデータを送信する¥

  useEffect(() => {
    convertMarkdownWorker.postMessage(text)
  }, [text])

  return (
    //Reactコンポーネントでは1つの要素を返す必要がありフラグメントを使わなない時はdivタグを書く
    <>
     {/** ヘッダーコンポーネントを呼び出している */}
      <HeaderArea>
        <Header title='Markdown Editor'>
          {/*保存するボタンを押した場合にモーダル表示フラグをONにする*/}
          <Button onClick={() => setShowModal(true)}>
            保存する
          </Button>
          <Link to="/history">
            履歴を見る
          </Link>
        </Header>
      </HeaderArea>
        
      <Wrapper>
        {/*onChange属性には、テキストの内容が変更された時に実行される関数を渡す
        eventという値が引数として渡され、event.target.valueにテキストの内容が格納され、そのテキストの内容をsetTextに渡すことで状態を更新する
  valueにはテキストの内容を渡すが、今回はuseStateで完了しているtextという変数を渡す*/}
        <TextArea 
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <Preview>
          {/**webworkerから受け取った処理結果で状態を更新 */}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Preview>
      </Wrapper>
      {/**モーダル判定がONになっている時だけ &&以降の処理が行われる
       * onSaveはindexedDBへの保存処理とモーダルを閉じるために、falseを引数に渡す
       * onCancelは閉じるだけなのでfalseを渡すだけ
       */}
      {showModal && (
        <SaveModal
          onSave={(title: string): void => {
            putMemo(title, text)
            setShowModal(false)
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}
