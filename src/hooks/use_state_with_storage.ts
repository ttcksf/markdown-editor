import { useState } from "react";

//init:stringは初期値でuseStateの引数と同じ
//key:stringはlocalStorageに保存する際のキー。
//[string,(s: string) => void]はカスタムフックの返り値で、useStateの返り値と同じ型になっている
export const useStateWithStorage = (init: string, key: string): [string, (s: string) => void] => {
  //useStateの呼び出しと同じでlocalStorageの値を取得しつつ、取得できない場合は引数の初期値を使う
  const [value, setValue] = useState<string>(localStorage.getItem(key) || init)

  const setValueWithStorage = (nextValue: string): void => {
    setValue(nextValue)
    localStorage.setItem(key, nextValue)
  }
  //useStateから取得した値とlocalStorageへの保存を組み合わせた更新関数を返す
  return [value, setValueWithStorage]
}
