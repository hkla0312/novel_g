# 『アカノユメ』縦スライス版

文章、選択肢、時間経過だけで進行するブラウザ向けホラーノベルADVです。画像・立ち絵・BGM・SE・バックエンドは使用していません。

## 1. 起動方法

```bash
npm install
npm run dev
```

表示されたローカルURLをPCまたは同一ネットワーク上のスマートフォンで開きます。開発サーバーは `0.0.0.0:5173` で待ち受けます。

## 2. Build方法

```bash
npm run build
npm run preview
```

型チェックを通過した成果物が `dist/` に生成されます。補助コマンドは `npm run lint`、`npm test`、`npm run validate` です。

### GitHub Pagesへの公開

`main` ブランチへpushすると、`.github/workflows/deploy-pages.yml` がPagesを有効化して、ビルドと公開を自動実行します。サブパスはリポジトリ名から自動設定されるため、リポジトリ名を変更してもVite側の修正は不要です。

## 3. ディレクトリ構造

```text
src/
  components/  UI、モーダル、Debug Panel
  engine/      条件評価、Effect適用、遷移、validation
  scenario/    Reactから独立したシナリオデータ
  store/       Zustand GameState、localStorageセーブ
  types/       Scenario / GameStateの型
  utils/       時刻表示などの純粋関数
```

## 4. シナリオエンジンの構造

`ScenarioNode[]` を `scenario/index.ts` で一つの辞書にまとめます。画面は現在ノードを読むだけで、遷移、条件、Effectは `engine/` が解釈します。本文は `text`、知識に応じた再読差分は `variants`、通常遷移は `next`、分岐は `choices` で表現します。

## 5. GameState

`currentNode`、0:00からの経過分 `currentTime`、`flags`、`knowledge`、`selfMemory`、`visitedNodes`、`visitedLocations`、`backlog` を保持します。将来の内部評価用に非表示の `hidden`（FACT / UNDERSTANDING / SELF）も持ちます。UIへ数値ゲージとしては表示しません。

## 6. 新しいScenarioNodeの追加方法

`src/scenario/` の適切なファイルへ、重複しない `id` を持つノードを追加します。その配列を `scenario/index.ts` の `scenarioNodes` に含めてください。Reactコンポーネントの変更は不要です。

```ts
{ id: 'new_scene', title: '場所', text: ['本文。'], next: 'next_scene', timeCost: 5 }
```

## 7. 選択肢の追加方法

ノードの `choices` に追加します。`next` は既存ノードIDである必要があります。

```ts
{ label: '扉を開ける', next: 'inside', timeCost: 2, effects: [] }
```

## 8. conditionの書き方

`flag`、`knowledge`、`selfMemory`、`visitedNode`、`visitedLocation`、`time` を利用できます。`all` がAND、`any` がOR、`not` が否定です。

```ts
{
  type: 'all',
  conditions: [
    { type: 'knowledge', key: 'jigaeshi_meaning' },
    { type: 'time', atOrBefore: 720 }
  ]
}
```

## 9. effectの書き方

`setFlag`、`addKnowledge`、`addSelfMemory`、`visitLocation`、`adjustHidden` をノードまたは選択肢の `effects` に並べます。

```ts
effects: [
  { type: 'addKnowledge', key: 'new_fact' },
  { type: 'setFlag', key: 'door_open', value: true }
]
```

## 10. location再探索の実装方法

探索ハブへ戻る選択肢を用意し、対象ノードの `variants` に `knowledge` / `selfMemory` / `flag` 条件を指定します。最初に条件を満たしたvariantが本文として選ばれます。家族写真は `jigaeshi_meaning` の取得前後で意味が変わる実装例です。

## 11. saveDataVersion

セーブは3スロットで、キーは `akano-yume:save:1` から `:3` です。各データに `saveDataVersion` と保存日時を持たせます。現在はversion 1。将来は `store/saveStorage.ts` の `migrate` へ段階的な移行処理を追加できます。

## 12. Debug Panel

開発時は右上の `DEBUG` から、現在ノード、時刻、各種状態、訪問履歴を確認できます。ノードジャンプ、時刻変更、flag / knowledgeの付与と削除が可能です。本番ビルドでは既定で無効です。必要な検証ビルドだけ `VITE_ENABLE_DEBUG=true` を指定します。

## 13. 現在プレイ可能な範囲

PROLOGUE、負傷と応急処置、母・妹との会話、自由行動（病院・警察・自宅探索）、知識取得後の再探索、団地での隣人死亡判明、母への確認電話、縦スライス終了までプレイできます。病院・警察・自宅は順不同で、一部探索は再訪できます。図書館は将来範囲への導線のみです。

