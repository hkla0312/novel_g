# BGM／人間プレイテスト環境 実装レポート

## Audio

- `AudioManager`がBGMと環境音を独立管理する。
- ユーザーの最初のクリック／タップ／キー入力後だけ再生を試みる。
- 同一トラックの再指定ではAudio要素を作り直さない。
- PROLOGUEは夜の環境音、起床後はMAIN、仏間ではMAINをfade outし、A4で低音量のMAINへ戻す。
- BAD／NORMAL／TRUE／SECRETへ別々のENDINGトラックを割り当てた。
- CONFIGのBGM、AMBIENCE / SE、MUTEはlocalStorageへ保存する。
- 権利未確認音源は収録していない。`public/audio/README.md`の6ファイルが未設定。

## Human playtest

- `?playtest=1`で有効になる。通常モードには質問・記録UIを表示しない。
- 選択時に表示選択肢、選択内容、node、ゲーム内時刻、実時間を記録する。
- knowledge、selfMemory、flag、ARCHIVE解放、location遷移、主要milestone、ENDINGと最終snapshotを記録する。
- 6か所の短い解釈質問、ACT5選択理由、ENDING後15問と6評価軸を用意した。
- TRUE条件、hidden値、不足knowledgeはプレイヤーへ表示しない。
- END後の`EXPORT TEST LOG`は1セッション1 JSONをBlob downloadする。
- `npm run report:human`が複数JSONを集計し、A情報不足／B理解不足候補／C選択不一致候補を補助分類する。

## 検証

- ブラウザで`?playtest=1`、CONFIG、節目質問、ENDINGアンケート、EXPORTボタンを確認。
- 自動ブラウザ環境ではBlob downloadイベントを捕捉できなかったが、標準のdownload属性付きBlob URL実装を使用している。
- `npm test`: 38件成功。
- lint、build、scenario validation成功。
- 10,000周simulationは従来値と一致し、softlock 0。ENDING条件・knowledge条件・agent weightは未変更。

