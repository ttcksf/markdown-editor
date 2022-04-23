import Dexie from 'dexie'

export interface MemoRecord{
  datetime: string
  title: string
  text: string
}

const database = new Dexie('markdown-editor')
database.version(1).stores({memos: '&datetime'})
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async(title: string, text: string): Promise<void> => {
  const datetime = new Date().toISOString()
  await memos.put({datetime, title, text})
}

//１ページあたりの１０件と定義
const NUM_PER_PAGE: number = 3
export const getMemoPageCount = async (): Promise<number> => {
  //memosテーブルから総件数を取得する。count()はDexieによって定義された関数
  const totalCount = await memos.count()
  //トータルの件数から１ページあたりの件数である１０で割って、ページ数を計算。０件の場合は１ページとする。
  const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
  return pageCount > 0 ? pageCount : 1
}
//テキスト履歴をリストで取得するための関数を定義。返り値は配列にしておく
export const getMemos = (page: number): Promise<MemoRecord[]> => {
  const offset = (page - 1) * NUM_PER_PAGE
  return memos.orderBy('datetime')
        .reverse()
        /**offsetは取得するリスト内の開始位置を設定している */
        .offset(offset)
        /*limitは取得する件数を設定する*/
        .limit(NUM_PER_PAGE)
        .toArray()
}
