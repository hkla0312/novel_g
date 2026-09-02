# 『アカノユメ』Knowledge Map v2

> Key名は実装候補。設計レビュー後に既存GameStateへ割り当てる。ARCHIVEはGameStateから導出し、独立した「真実リスト」を持たない。

## 1. 情報レイヤー

| レイヤー | 意味 | ARCHIVE表現 |
|---|---|---|
| FACT | 主人公が直接確認した物・出来事 | 「確認した」「あった」 |
| TESTIMONY | 誰かの証言 | 「母は～と話した」「近隣住民によれば」 |
| RUMOR | 出所・詳細が曖昧な伝聞 | 「～らしい。詳細不明」 |
| DOCUMENT | 新聞、Web保存、紙など媒体に存在する記述 | 「資料には～とある」 |
| INFERENCE | 複数情報から主人公が考えた可能性 | 事実と別段落で「可能性」 |
| SELF | 主人公自身の記憶 | 「思い出した範囲」 |

同じ題材でも、レイヤーが更新されるまで前段階を事実化しない。

## 2. 必須情報チェーン

| Key候補 | レイヤー | 取得元 | 最短時期 | 前提 | 解放先 | 漏洩防止 |
|---|---|---|---|---|---|---|
| `mother_admitted_injury` | TESTIMONY/FACT | 朝の母との会話、腕の傷 | PROLOGUE | なし | 母の異常調査 | 未取得状態は存在しない必須情報 |
| `mother_dividing_language` | TESTIMONY | 母の「分ける／家のもの」 | PROLOGUE | なし | 後期A4比較 | A4取得前に「宗教語」と分類しない |
| `neighbor_care_link` | TESTIMONY | 妹 | ACT1 | 質問前の先出し会話 | 老人への質問 | 老人を洗脳者と書かない |
| `neighbor_dead_rumor` | TESTIMONY | 団地入口の年配女性 | ACT2 | 団地へ戻る | 母への確認 | 「死亡確定」としない |
| `mother_claims_postmortem_contact` | TESTIMONY | 母への電話 | ACT2 | 死亡の噂 | 死亡確認 | 幽霊・幻覚と分類しない |
| `neighbor_death_official` | FACT | 住宅管理／公開情報 | ACT2 | 死亡の噂 | 老人宅・事件調査 | 管理側は過去傷害の詳細を開示しない |
| `mother_entered_after_death` | FACT+TESTIMONY | 妹、介護用品 | ACT2～3 | 死亡日時 | 死後介護の確立 | 妹は老人を見たとは言わない |
| `key_opens_neighbor_home` | FACT | 老人宅ドア | ACT2 | 母室三段階探索 | 老人宅 | 鍵取得時点では用途不明 |
| `akano_yume_document` | DOCUMENT | 仏壇の引き出しのA4 | ACT3 | 仏間を調べる | 事件検索語、名称 | 取得前にARCHIVEへ名称を出さない |
| `incident_leads_found` | DOCUMENT | A4裏・別紙・URL断片 | ACT3 | A4 | ACT4事件調査 | 事件内容を同時に取得しない |
| `source_site_authored` | FACT+SELF | 旧PC、ハンドルネーム、制作記憶 | ACT5 | PC段階1 | 作者疑惑 | 本名メタデータを証拠にしない |
| `source_site_not_akano_yume` | DOCUMENT | 旧PC全ページ比較 | ACT5 | PC段階2 | 単一作者説の否定 | 名称未取得なら「アカノユメ」と比較しない |
| `brother_helped_by_words` | TESTIMONY | 義弟核心会話 | ACT6 | 義弟への質問 | TRUE解釈 | 読む前から救いを代弁しない |
| `mother_returns_with_meal` | FACT | 夕方の実家 | FINAL | ACT6終了 | 最終選択 | 死後会話の答えを追加しない |

## 3. ACT1情報

| Key候補 | 取得者・場所 | 内容 | Variant用途 |
|---|---|---|---|
| `sister_previous_contact` | 妹・実家 | 母に強く掴まれたり噛まれたりしたことがある | 主人公が妹の安全へ言及できる |
| `neighbor_profile_rumor` | 妹・実家 | 暗い印象、前住居で何かあったらしい | 序盤の疑いを強める |
| `mother_initially_feared_butsuma` | 妹・実家 | 母は最初「あの部屋は嫌」と言った | 後半に洗脳説を弱める |
| `neighbor_did_not_recruit` | 妹または義弟 | 老人は「見なくていい」と言った | 老人が布教者ではない材料 |
| `mother_care_notes` | 母の部屋 | 食事、薬、洗濯、ゴミの詳細 | 母の善意・介護の継続 |
| `injury_medically_treated` | 病院 | 傷は浅いが安全確保が必要 | 母帰宅時の腕の台詞variant |
| `police_consulted` | 警察 | 傷害、安全、避難について相談済み | 後の警察会話variant |
| `local_rite_term_heard` | 病院待合室で会話した時のみ | 地還し等の呼称 | 図書館の検索効率 |

## 4. ACT2情報

| Key候補 | レイヤー | 取得元 | 更新関係 |
|---|---|---|---|
| `neighbor_injury_rumor` | RUMOR | 団地入口の年配女性 | 後に`neighbor_injury_report`で一部確認 |
| `neighbor_death_datetime` | FACT | 住宅管理、死亡記事 | `neighbor_dead_rumor`を公的確認へ更新 |
| `neighbor_single_tenancy` | FACT | 住宅管理 | 単身・年金生活のみ。過去事件詳細なし |
| `mother_visited_yesterday` | TESTIMONY | 妹 | 入室のみ。会話相手は未確認 |
| `postmortem_care_note` | DOCUMENT | 母の介護メモ | 死亡後も記録が続く |
| `unidentified_old_key` | FACT | 母の小箱 | 老人宅とはまだ書かない |

### 母の部屋再探索

1. 初回：介護の具体性。`motherRoomSearchCount=1`。
2. 二回目：死亡後の日付に注意が向き、小箱は生活用品の一部として認識。`old_box_noticed=true`。
3. 三回目：「さっきの小箱を調べる」。無銘の鍵。`unidentified_old_key`。
4. 老人宅で開いた時：`key_opens_neighbor_home`。

回数によるアイテム出現ではなく、知識と注意対象の変化として本文を分ける。

## 5. ACT3情報

| Key候補 | レイヤー | 取得元 | 未取得時に禁止する言及 |
|---|---|---|---|
| `neighbor_wife_photo` | FACT | 居間・仏間 | 妻との死別、喪失 |
| `neighbor_family_photo_gap` | FACT | 写真棚 | 家族断絶の断定 |
| `neighbor_new_year_cards_stop` | FACT | 引き出し | 傷害事件との因果 |
| `postmortem_care_items` | FACT | 冷蔵庫・薬 | 老人が食べた／飲んだという結論 |
| `butsuma_layered_materials` | FACT | 仏間 | アカノユメの名称、儀式認定 |
| `akano_yume_document` | DOCUMENT | A4 | 原典、教義、作者という呼称 |
| `neighbor_faith_long_term` | INFERENCE | 紙の年代差 | 妻の死が原因という断定 |
| `incident_leads_found` | DOCUMENT | URL・記事名断片 | 事件の結末 |

## 6. ACT4事件情報

### I-01 父親失踪

| Key候補 | 取得元 | 内容 |
|---|---|---|
| `i01_occult_summary` | コピーHTML | 赤い糸と失踪を怪異として紹介 |
| `i01_newspaper_fact` | 地方紙 | 失踪、鞄、家庭内相談歴 |
| `i01_possible_survival` | 別地域記事 | 生存・自発的失踪の可能性。本人同定は未確定 |

### I-02 女性転落

| Key候補 | 取得元 | 内容 |
|---|---|---|
| `i02_occult_summary` | まとめページ | 赤い夢の後の儀式死と紹介 |
| `i02_death_report` | 地方紙 | 転落死のみ確認。死因区分は不明 |
| `i02_identity_uncertain` | 保存ブログ比較 | ブログ主と死亡女性の同一性が未確定 |

### I-03 介護家庭

| Key候補 | 取得元 | 内容 |
|---|---|---|
| `i03_self_harm_post` | 保存掲示板 | 自傷と「赤い紙」への言及 |
| `i03_survived` | 後日投稿 | 生存し支援へ繋がった |
| `i03_reinterpreted_help` | 後日投稿 | 「一人で持つな」を相談する意味へ変更 |

### I-04 老人傷害

| Key候補 | 取得元 | 内容 |
|---|---|---|
| `neighbor_injury_report` | 地方紙 | 孫世代の親族への傷害、警察対応 |
| `neighbor_nonprosecution` | 続報 | 不起訴 |
| `neighbor_move_after_incident` | 記事年代＋入居記録 | 事件後に転居した時系列 |
| `neighbor_injury_faith_link` | プレイヤー推測 | A4との関係。事実欄へ統合しない |

### 事件横断

| Key候補 | 条件 | 意味 |
|---|---|---|
| `incidents_look_connected` | 怪異側資料を2件以上 | 中盤の連続事件仮説 |
| `incident_outcomes_diverge` | 裏取りを2件以上 | 死亡、失踪、生存、傷害が混在 |
| `no_single_ritual_pattern` | 文言比較を3件以上 | 同じ手順・正典がない |
| `readers_added_meaning` | I-03後日＋別事件差分 | 読者が状況に合わせて意味を変えた |

## 7. ACT5自己記憶と旧PC

| Key候補 | 種別 | 取得元 | 内容 |
|---|---|---|---|
| `loss_father` | SELF | 仏壇／about.html | 父の死と意味付けへの反発 |
| `childhood_rite_sensory_memory` | SELF | 写真＋地還し資料 | 赤土、大人の手、手首の感覚 |
| `old_web_creation` | SELF | HTML本／旧PC | 個人サイト制作 |
| `online_friend_mina` | SELF | ヘッドセット／メール | ミナとの交流 |
| `source_site_authored` | FACT+SELF | ハンドルネーム、文章、制作記憶 | 主人公が旧サイトを書いた |
| `source_site_inaccurate` | DOCUMENT | 郷土資料との比較 | 主人公サイトにも誤解がある |
| `source_site_not_akano_yume` | DOCUMENT | 全ページ検索 | 名称、血、刃物、傷がない |
| `copies_predate_elder_print` | DOCUMENT | 複数HTML年代 | 老人のA4は中間的コピー |
| `no_single_author_found` | INFERENCE | コピー差分＋ミナ | 一人の作者へ遡れない |

### PC本文variant

- A4未取得：老人の紙との比較をしない。
- 地還し未取得：郷土資料との一致を言わない。
- ミナ未回想：メール差出人を「ミナ」と即座に説明せず、古いアドレスと文面だけを見せる。
- アカノユメ名称未取得：サイトにその名称がない、とは言わない。
- 過去事件未調査：連続事件への影響を主人公に断定させない。

## 8. ACT6・FINALの解釈状態

情報取得とは別に、選択による解釈状態を持つ。

| Key候補 | 取得選択 | 意味 |
|---|---|---|
| `interpret_single_cause` | 事件を一つの怪異へまとめる | BAD方向 |
| `interpret_restore_original` | 原文へ戻せば解決すると考える | NORMAL方向 |
| `interpret_reader_meaning` | 義弟が得た意味を質問する | TRUE要素 |
| `recognize_help_and_harm_separate` | 救済意図と傷害結果を分ける | TRUE必須 |
| `boundary_no_harm` | 他者を傷つける解釈を明確に拒む | TRUE必須 |
| `mother_personhood_preserved` | 母を怪異の器や敵として扱わない | TRUE必須 |
| `accompany_mother` | 老人宅へ同行 | TRUE必須行動 |
| `mina_optional_chain` | ミナの不完全な記憶を最後まで聞く | SECRET候補 |

## 9. 赤い夢の漏洩防止

| 段階 | ARCHIVEに書けること |
|---|---|
| 主人公のみ | 子供の頃から時々見る。赤い空間、大人、手首。血や剃刀はない。 |
| 義弟証言後 | 義弟も「赤い夢」と呼ぶ夢を見る。ただし赤い部屋、文字、血が出る。 |
| 地還し＋写真後 | 主人公の夢と幼少期の行事には共通する感覚がある。 |
| 比較後 | 二人の夢は内容と、見始めた時期が違う。 |

「アカノユメが夢を見せる」「二人は同じ夢を見た」とは書かない。

## 10. ARCHIVE導出ルール

- 未取得Keyの項目は表示しない。
- 噂から公的確認へ更新しても、噂の出典は消さない。
- 傷害事件とA4の文言は別項目。推測を自動結合しない。
- 事件まとめページの記述は「まとめページによれば」と明記。
- 旧PC発見前に主人公サイトをアカノユメの原典と書かない。
- 旧PC発見後も「影響した可能性のある資料の一つ」に留める。
- END条件、収集率、重要マークは表示しない。

## 11. Validation要件

実装時にシナリオ構造検証へ次を追加する。

1. 本文variantが参照する固有名・事件名に対応knowledge条件があるか。
2. ARCHIVE factのconditionが、その文中の全固有情報を満たすか。
3. RUMORだけでFACT表現へ更新されていないか。
4. 旧PCの各比較文が、比較対象を取得済みか。
5. 義弟の夢と主人公の夢を同一視する文がないか。
6. 死後の老人の姿・声・物理的証明がないか。
7. SECRETが`true_cleared_previous`なしで到達不能か。


