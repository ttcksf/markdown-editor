import * as React from 'react'
import {
  Link,
  useHistory,
} from 'react-router-dom'
import styled from 'styled-components'
import { setTextRange } from 'typescript'
import {Header} from '../components/header'
import {
  getMemoPageCount,
  getMemos,
  MemoRecord,
} from '../indexeddb/memos'

const {useState, useEffect} = React


const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`
const Wrapper = styled.div`
  bottom: 3rem;
  let: 0;
  position: fixed;
  right: 0;
  top: 3rem;
  padding: 0 1rem;
  overflow-y: scroll;
`
const Memo = styled.button`
  display: block;
  background-color: white;
  border: 1px solid gray;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
`
const MemoTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

const MemoText = styled.div`
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
`

const Paging = styled.div`
  bottom: 0;
  height: 3rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem;
  right: 0;
  text-align: center;
`
const PagingButton = styled.button`
  background: none;
  border: none;
  display: inline-block;
  height: 2rem;
  padding: 0.5rem 1rem;

  &:disabled{
    color: silver;
  }
`


//テキストの状態を更新する関数を、引数として受け取る。テキストは不要だから更新関数だけ受ける
  interface Props {
    setText: (text: string) => void
  }

export const History: React.FC<Props> = (props) => {
  const {setText} = props
  const [memos, setMemos] = useState<MemoRecord[]>([])
  //pageは現在のページ
  const [page, setPage] = useState(1)
  //maxPageは最大ページ
  const [maxPage, setMaxPage] = useState(1)
  const history = useHistory()
  //useEffectはレンダリングの後に実行される
  //useEffectの第一引数には実行したい関数で、今回はgetMemo関数を実行して終わったら取得したテキスト履歴をsetMemosに渡して更新する
  //setMemosによって更新されると再描画が実行されて、取得された内容が表示される
  //useEffectの第二引数には変更を監視する状態の配列を渡すが、今回は空の配列にしていて、ずっと更新はされないから初回のみ実行される
  useEffect(() => {
    getMemos(1).then(setMemos)
    getMemoPageCount().then(setMaxPage)
  },[])
  //最大ページ数より小さかったら次のページネーションが続く
  const canNextPage: boolean = page < maxPage
  //２ページ目以降なら前のページに戻れる
  const canPrevPage: boolean = page > 1
  //ページネーションのボタンをクリックした時の関数。引数に遷移先のページ数を指定
  const movePage = (targetPage: number) => {
    //遷移したいページが遷移可能かどうか判定。できないときは処理停止（早期リターン）
    //遷移可能な場合は管理されている(page)を更新して、IndexedDBから新しいページのレコードを取得して、状態(memos)を更新する
    if(targetPage < 1 || maxPage < targetPage){
      return
    }
    setPage(targetPage)
    getMemos(targetPage).then(setMemos)
  }
  
  //historyはブラウザの履歴を扱うためのAPI
  return(
    <>
      <HeaderArea>
        <Header title='履歴'>
          <Link to="/editor">
            エディタに戻る
          </Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        {/**memosの中にある配列の要素をReactの要素に変換。mapは配列の要素を関数に渡して、返り値から更なる配列を作る
         * keyはReactが配列要素を再描画する際に、変更された要素を特定するために使用するためのキー。配列の変更箇所を特定しやすくなる
         * メモをクリックしたときにsetTextを使い、テキスト履歴のテキストで更新して、history.pushでエディタ画面に戻る
         */}
        {memos.map(memo => (
          <Memo 
            key={memo.datetime}
            onClick={() => {
              setText(memo.text)
              history.push('/editor')
            }}
          >
            <MemoTitle>{memo.title}</MemoTitle>
            <MemoText>{memo.text}</MemoText>
          </Memo>
        ))}
      </Wrapper>
      <Paging>
        <PagingButton
          onClick={() => movePage(page - 1)}
          disabled={!canPrevPage}
        >
          ＜
        </PagingButton>
        {page} / {maxPage}
        <PagingButton
          onClick={() => movePage(page + 1)}
          disabled={!canNextPage}
        >
        　＞
        </PagingButton>
      </Paging>
    </>
  )
}
