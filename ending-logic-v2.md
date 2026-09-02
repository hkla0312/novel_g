# 『アカノユメ』Ending Logic v2

> プレイヤー向け画面ではBAD/NORMAL/TRUE/SECRETを表示しない。ここでの分類名は制作内部用。

## 1. 設計原則

- 情報量の合計だけで分岐しない。
- 「何を知ったか」と「どう解釈したか」と「最後にどう行動したか」を分離する。
- 一つの最終選択肢だけでENDINGを決めない。ACT4～FINALの選択履歴を使う。
- TRUEは初見でも理論上可能。SECRETはTRUEクリア済みの次周以降のみ。
- 取得していない事実をENDING本文へ補完しない。本文variantを用意する。
- 母の死後会話を、どのENDINGでも説明しない。

## 2. 内部軸

既存の`FACT / SELF / UNDERSTANDING`は補助指標として残せるが、単純閾値だけでは使わない。

### FACT

事件と現在の出来事を、噂と確認済み情報へ分けて集めた量。

最低クラスタ：

- F1 母の傷害と発言。
- F2 老人の死亡と死後入室。
- F3 仏間A4またはアカノユメ名称。
- F4 過去事件の表面情報。
- F5 旧PCと主人公サイト。

### SELF

主人公が自身の感情と過去を、事実の外へ切り離さずに見た量。

- S1 父の死。
- S2 地域の意味付けへの反発。
- S3 個人サイト制作。
- S4 ミナとの交流。
- S5 自分のサイトにも誤解と感情が混ざっていた認識。

### UNDERSTANDING

他者の意味を肯定する点数ではなく、異なる解釈と倫理境界を同時に扱えた履歴。

- U1 老人が受信者だった可能性を見る。
- U2 義弟が言葉に救われた経験を聞く。
- U3 母の善意と傷害を別々に扱う。
- U4 作者の意図と読者の意味が一致しないと理解する。
- U5 信仰を否定せず、他害を止める。

## 3. 解釈フラグ候補

| Flag | 立つ場面 | 排他・関係 |
|---|---|---|
| `interpret_single_cause` | 過去事件を一つの怪異と結論 | `interpret_plural_causes`と排他 |
| `interpret_plural_causes` | 各事件の事情の差を見る | TRUE候補 |
| `interpret_restore_original` | 原文へ戻すことを解決の中心にする | NORMAL候補。TRUEと完全排他ではない |
| `interpret_reader_meaning` | 義弟へ「どこが間違っていないと思った？」 | TRUE必須 |
| `recognize_help_and_harm_separate` | 老人・母・義弟の比較 | TRUE必須 |
| `boundary_no_harm` | 「楽になったことは否定しない。人を傷つけるのは止める」 | TRUE必須 |
| `mother_personhood_preserved` | 母を怪異・狂人と呼ばず話を聞く | TRUE必須 |
| `mother_fact_only_confrontation` | 死亡事実だけで母を論破する | NORMAL/BAD方向 |
| `family_trust_abandoned` | 「全員取り込まれている」と結論 | BAD強制条件候補 |
| `accompany_mother` | 食事を持つ母に同行 | TRUEの行動条件 |

## 4. 共通ゲート

ENDING判定へ入るには、以下の必須進行だけを要求する。

- PROLOGUE完了。
- 老人死亡の客観確認。
- 老人宅または別経路でアカノユメ名称を取得。
- 過去事件を最低2件確認（表面情報のみでも可）。
- 旧PCの二段反転を完了。
- 義弟の核心会話。
- 母の夕方帰宅。

任意情報不足でsoftlockさせない。

## 5. BAD内部条件

### 優先条件

以下のいずれかを満たし、TRUE条件を満たさない場合。

1. `family_trust_abandoned=true`。
2. `interpret_single_cause=true`かつ、FINALで母を敵・感染源として扱う。
3. 事件の怪異側資料を集めたが、裏取りをほぼせず、恐怖に従う選択を重ねる。

### 必要な心理経路

事実が少ないからBADになるのではない。赤い共通項だけを集め、一つの原因へまとめた時にBADへ近づく。

### 本文variant

- 老人傷害未確認：孫や不起訴へ言及しない。
- A4未取得：黄ばんだ紙を物理的に読ませない。別のコピーHTMLを使う。
- 義弟の夢未聴取は共通ゲート上あり得ないため、必須会話で取得する。
- 過去事件は取得済み事件だけを思い返す。

### 結末

主人公は資料を「赤い夢から戻る方法」「痛みを外へ出す方法」と自分向けに読み替える。「少しだけ」から始まり、自傷がエスカレートする。

表示題名：`アカノユメをみた。`

## 6. NORMAL内部条件

### 必須条件

- `source_site_authored=true`。
- `source_site_not_akano_yume=true`。
- 母を現実の支援へ繋ぐ選択をする。
- BAD強制条件がない。
- TRUEの解釈条件が不足。

代表条件：`interpret_restore_original=true`または`mother_fact_only_confrontation=true`。

### 心理経路

主人公は、元の意味と事実を示すことで母を戻そうとする。実際に安全確保と支援へ繋げるため失敗ではない。ただし、作者の意図を正しい基準として扱う。

### 数年後

義弟の部屋または持ち物に、小さな赤い紙と「一人で全部抱えなくていい」という書き足しがある。義弟の失踪・死亡・自傷は示さない。情報が次の形へ変わった事実だけを残す。

表示題名：`帰宅`

## 7. TRUE内部条件

### 事実ゲート

- `neighbor_death_official=true`
- `akano_yume_document=true`または同等の一次資料
- `incident_outcomes_diverge=true`
- `source_site_authored=true`
- `source_site_not_akano_yume=true`

すべての過去事件、老人傷害の裏取り、ミナ深掘りは必須にしない。

### 解釈ゲート

- `interpret_plural_causes=true`
- `interpret_reader_meaning=true`
- `recognize_help_and_harm_separate=true`
- `boundary_no_harm=true`
- `mother_personhood_preserved=true`

### 行動ゲート

- `accompany_mother=true`
- 老人宅で母の認識を存在論的に論破せず、「今日は俺と帰ろう」を選ぶ。
- その後、家族・医療・生活支援へ繋ぐ。

### 許容する不足

- 老人の傷害事件を知らなくてもTRUE可。その場合、老人の具体的加害へENDING本文で言及しない。
- 地還し詳細がなくても、事件差分と義弟理解が十分ならTRUE可。ただし主人公の夢の合理的候補は弱く残る。
- ミナ未接触でもTRUE可。SECRETのみ閉じる。

### 結末

救いだった意味を否定せず、他害の地点で境界を引く。母はすぐ回復しない。死後会話の謎を語り直さず、家族の生活へ戻る。

表示題名：`それでも、信じる`

## 8. SECRET内部条件

### 周回条件

- 永続進行`true_cleared_previous=true`。
- 初回TRUE到達時、その同じGameSnapshotへこの値を注入しない。
- 「最初から」で作った次周Snapshot、または次周セーブをロードした時だけ有効。

### 当該周回条件

- TRUE条件を再度満たす。
- `online_friend_mina`回収。
- ミナへ連絡し、任意会話を最後まで進める。
- 原サイト主要ページとメールを回収。
- コピーHTMLを最低2世代比較。
- `no_single_author_found=true`。
- 義弟の救いを否定しない。

### 結末

削除、ハッキング、完全訂正はしない。二人は小さな無害な読み替えを同じ分散経路へ置く。年月後、それは二人の意図とも少し違うおまじないへ変わる。最後に初めて会う。

表示題名：`アカノユメ`

エンディング一覧ではシークレット題名を開示せず、回収後も`？？？？（閲覧条件：回収済）`とする。

## 9. 判定優先順位

1. 次周限定SECRET条件を満たし、TRUE本文後の追加選択を選んだ場合：SECRET。
2. TRUEの事実・解釈・行動ゲートを満たす：TRUE。
3. BAD強制条件を満たす：BAD。
4. 共通ゲートを満たし現実支援へ繋いだ：NORMAL。
5. 安全弁：共通ゲート後に家族への信頼を切り、自傷方向へ進んだ場合のみBAD。情報不足だけでBADに落とさない。

TRUEを最優先にすることで、途中で一度怪異説を疑っても、その後の再解釈を認める。

## 10. 分岐本文の条件表

| 本文情報 | 必要条件 |
|---|---|
| 老人が孫世代を傷つけた | `neighbor_injury_report` |
| 老人が不起訴 | `neighbor_nonprosecution` |
| 老人が妻を早く亡くした | `neighbor_wife_photo`＋補強資料、または明示証言 |
| 母が当初仏間を怖がった | `mother_initially_feared_butsuma` |
| 主人公の夢と地還しの共通点 | `childhood_rite_sensory_memory` |
| 義弟の夢が読後に始まった | `brother_dream_timing` |
| 主人公サイトとA4の差 | `source_site_not_akano_yume`＋`akano_yume_document` |
| アカノユメに単一作者がいない | `no_single_author_found`。それ以前は可能性表現 |
| 事件が一つの連続殺人ではない | `incident_outcomes_diverge` |

## 11. 到達テスト

実装後、固定シードまたは決定的ルートで確認する。

1. 表面資料偏重 → BAD。
2. 旧PCと支援行動、義弟理解不足 → NORMAL。
3. 事件差分＋義弟理解＋母同行＋境界選択 → TRUE。
4. 初回TRUEから同周回SECRETへ行けない。
5. TRUE済み次周＋ミナ深掘り → SECRET。
6. 老人傷害未取得TRUE本文に孫・不起訴が出ない。
7. 地還し未取得ENDINGに主人公の夢の原因説明が出ない。
8. ミナ未取得ENDINGにミナの発言が出ない。
9. 全ENDINGで死後の老人の声・姿・物理証拠が出ない。
10. 任意事件を一件も全解明しなくてもsoftlockしない。


