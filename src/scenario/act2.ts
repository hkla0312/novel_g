import type { Condition, ScenarioNode } from '../types/scenario'

const beforeWorkCall: Condition = { type: 'time', atOrBefore: 959 }
const notFlag = (key: string): Condition => ({ type: 'not', condition: { type: 'flag', key } })
const availableBefore = (condition: Condition): Condition => ({ type: 'all', conditions: [beforeWorkCall, condition] })

export const act2Nodes: ScenarioNode[] = [
  {
    id: 'act2_opening', title: '死亡確認', location: 'housing_complex', text: [
      '母さんは「仕事に戻るから」と電話を切った。',
      '老人は死んでいる。母さんは昨日会ったと言う。どちらかを錯覚や嘘にすれば話は簡単になる。だが今の俺には、そう決めるだけの材料がない。',
      'まず死亡そのものを確認する。母さんが隣室へ行った時期も、別の人間から確かめる必要がある。',
    ], next: 'verification_hub',
  },
  {
    id: 'verification_hub', title: '情報を確かめる', location: 'housing_complex', text: [
      '一つの証言だけで結論を作るべきではない。確認できる事実を増やす。推測はその後だ。',
    ], choices: [
      { label: '妹に確認する', next: 'verify_sister', timeCost: 20, condition: notFlag('verified_with_sister') },
      { label: '団地管理側へ確認する', next: 'verify_management', timeCost: 50, condition: notFlag('verified_with_management') },
      { label: '警察へ正式な確認を取る', next: 'verify_police', timeCost: 120, condition: notFlag('verified_with_police') },
      { label: '前の傷害事件を警察へ追加確認する', next: 'verify_police_history', timeCost: 40, condition: { type: 'all', conditions: [{ type: 'flag', key: 'verified_with_police' }, { type: 'any', conditions: [{ type: 'knowledge', key: 'neighbor_injury_rumor' }, { type: 'knowledge', key: 'neighbor_family_trouble_record' }] }, notFlag('verified_neighbor_history_with_police')] } },
      { label: '確認した情報を持って団地へ戻る', next: 'act2_hub', condition: { type: 'flag', key: 'neighbor_death_official' } },
    ],
  },
  {
    id: 'verify_sister', title: '妹に確認する', location: 'home', text: [
      '「隣のおじいさんが死んだって知ってたか」',
      '『え？　知らない。いつ？』',
      '数日前だと伝えると、妹の返事が止まった。',
      '「母さん、昨日も隣へ行ったのか」',
      '『行ったよ。夕方にゼリー持って。帰ってきて、今日は食欲がないみたいって言ってた』',
      '妹は死亡を知らなかった。だが母さんが昨日、隣室へ入ったことは見ている。母さんの記憶だけではない。',
    ], choices: [{ label: 'ほかの確認を続ける', next: 'verification_hub' }], effects: [
      { type: 'setFlag', key: 'verified_with_sister', value: true },
      { type: 'addKnowledge', key: 'mother_visited_neighbor_yesterday' },
    ],
  },
  {
    id: 'verify_management', title: '団地管理側へ確認する', location: 'housing_complex', text: [
      '管理窓口では、個人情報なので詳しい事情は話せないと言われた。事情を説明し、俺が隣室の居住者の家族ではないことも正直に伝えた。',
      '職員は記録を確認してから答えた。',
      '「亡くなられたのは四日前です。発見後、警察と親族の確認も済んでいます」',
      '前住所からの入居書類には、親族間のトラブルと警察対応後の単身転居とだけあった。県営住宅では年金を中心に暮らしていたという。',
      '「事件の内容までは、こちらではお答えできません」',
      '「母は、その後も部屋へ出入りしていたかもしれません」',
      '「その件はこちらでは分かりません。鍵についても管理側からお渡しはできません」',
      '死亡日時は確認できた。母さんが誰と話したのかは、やはり分からない。',
    ], choices: [{ label: '団地へ戻る', next: 'verification_hub' }], effects: [
      { type: 'setFlag', key: 'verified_with_management', value: true },
      { type: 'setFlag', key: 'neighbor_death_official', value: true },
      { type: 'addKnowledge', key: 'neighbor_death_datetime' },
      { type: 'addKnowledge', key: 'neighbor_single_pension_tenancy' },
      { type: 'addKnowledge', key: 'neighbor_family_trouble_record' },
      { type: 'adjustHidden', key: 'FACT', amount: 1 },
    ],
  },
  {
    id: 'verify_police', title: '正式な確認', location: 'police', variants: [
      {
        condition: { type: 'flag', key: 'police_consulted' },
        text: [
          '朝に相談した警察官が対応した。俺は推測を除き、近隣住民から死亡を聞いたことと、母さんが昨日会ったと主張していることだけを伝えた。',
          '「確認には時間がかかります。あなたへ開示できない情報もあります」',
      '待った後、老人が四日前に死亡し、必要な手続きが進んでいることだけは確認された。',
          '「お母さんの話が何を意味するかは、こちらでは判断できません。まず安全を優先してください」',
          '当然の返答だ。死亡は事実になった。それ以上はまだ推測のままだ。',
        ],
      },
    ], text: [
      '事情を最初から説明した。傷害のこと、隣人の死亡を聞いたこと、母さんが昨日会ったと主張していること。',
      '警察官は確認できる事実と家族の発言を分けて記録した。長く待った後、老人が四日前に死亡していることだけは確認された。',
      '母さんの認識については医療や安全確保も含めて家族で対応するよう勧められた。警察は答えを持っていない。無能なのではなく、答えられる範囲を越えている。',
    ], choices: [{ label: '団地へ戻る', next: 'verification_hub' }], effects: [
      { type: 'setFlag', key: 'verified_with_police', value: true },
      { type: 'setFlag', key: 'neighbor_death_official', value: true },
      { type: 'addKnowledge', key: 'neighbor_death_official_record' },
      { type: 'adjustHidden', key: 'FACT', amount: 1 },
    ],
  },
  {
    id: 'verify_police_history', title: '過去の傷害事件', location: 'police', text: [
      '噂と住宅管理の記録を分けて説明した。警察官は、確認できる範囲は限られると断った上で過去の対応記録を調べた。',
      '老人が孫世代の親族へ怪我を負わせた件で、警察が対応していた。結果は不起訴。その後、老人は前の住居を退去している。',
      '記録にアカノユメや宗教的な儀式という記載はない。何を考えていたのかまでは、事実として確認できなかった。',
    ], choices: [{ label: '確認結果を持って団地へ戻る', next: 'verification_hub' }], effects: [
      { type: 'setFlag', key: 'verified_neighbor_history_with_police', value: true },
      { type: 'addKnowledge', key: 'neighbor_relative_injury_confirmed' },
      { type: 'addKnowledge', key: 'neighbor_nonprosecution_and_eviction' },
      { type: 'adjustHidden', key: 'FACT', amount: 1 },
    ],
  },
  {
    id: 'act2_hub', title: '自由調査', location: 'housing_complex', text: [
      '確認できた事実を手掛かりに、調べる場所を選ぶ。時刻だけは何事もなかったように進んでいる。',
    ], variants: [{
      condition: { type: 'time', atOrAfter: 960 },
      text: ['スマートフォンが震えた。画面には勤務先の塾の名前が出ている。'],
    }], choices: [
      { label: '勤務先からの電話に出る', next: 'work_call_1600', condition: { type: 'time', atOrAfter: 960 } },
      { label: '死亡確認を続ける', next: 'verification_hub', condition: availableBefore({ type: 'any', conditions: [notFlag('verified_with_sister'), notFlag('verified_with_management'), notFlag('verified_with_police')] }) },
      { label: '自宅を再探索する', next: 'home_act2', timeCost: 5, condition: beforeWorkCall },
      { label: '黄ばんだ紙を持って昔の部屋へ戻る', next: 'old_room_paper_memory', timeCost: 17, condition: availableBefore({ type: 'all', conditions: [{ type: 'knowledge', key: 'akano_yume_document' }, notFlag('old_room_paper_memory_done')] }) },
      { label: '老人宅へ行く', next: 'neighbor_door', timeCost: 5, condition: availableBefore({ type: 'all', conditions: [{ type: 'flag', key: 'neighborApartmentKey' }, { type: 'flag', key: 'neighbor_death_official' }] }) },
      { label: '図書館へ行く', next: 'library_hub', timeCost: 15, condition: availableBefore({ type: 'any', conditions: [{ type: 'flag', key: 'library_lead' }, { type: 'knowledge', key: 'local_custom_heard' }, { type: 'knowledge', key: 'akano_yume_document' }] }) },
      { label: 'ミナに連絡する', next: 'mina_contact', timeCost: 12, condition: availableBefore({ type: 'all', conditions: [{ type: 'flag', key: 'mina_unlocked' }, notFlag('mina_contacted')] }) },
      { label: '調査内容を整理する', next: 'act2_review_notes', timeCost: 20, condition: beforeWorkCall },
    ],
  },
  {
    id: 'act2_review_notes', title: '整理する', text: [
      '事実と推測を分けて書く。老人の死亡。母さんの訪問。赤い物。古い言葉。',
      'この四つの間には、まだ埋まっていない穴がある。',
    ], next: 'act2_hub',
  },
  {
    id: 'home_act2', title: '自宅再探索', location: 'home', text: [
      '同じ部屋でも、知ったことが増えると目に入る物が変わる。今度は何を探すか決めてから見る。',
    ], choices: [
      { label: '母親の部屋を調べる', next: 'mother_room_first', timeCost: 18, condition: { type: 'hidden', key: 'motherRoomSearchCount', atMost: 0 }, effects: [{ type: 'adjustHidden', key: 'motherRoomSearchCount', amount: 1 }, { type: 'setFlag', key: 'mother_room_first_done', value: true }] },
      { label: '母親の部屋をもう一度調べる', next: 'mother_room_second', timeCost: 18, condition: { type: 'hidden', key: 'motherRoomSearchCount', atLeast: 1, atMost: 1 }, effects: [{ type: 'adjustHidden', key: 'motherRoomSearchCount', amount: 1 }] },
      { label: 'さっきの小箱を調べる', next: 'mother_room_third', timeCost: 18, condition: { type: 'hidden', key: 'motherRoomSearchCount', atLeast: 2, atMost: 2 }, effects: [{ type: 'adjustHidden', key: 'motherRoomSearchCount', amount: 1 }, { type: 'setFlag', key: 'neighborApartmentKey', value: true }] },
      { label: '母親の部屋を確認する', next: 'mother_room_exhausted', condition: { type: 'hidden', key: 'motherRoomSearchCount', atLeast: 3 } },
      { label: '仏壇を見る', next: 'act2_home_altar', timeCost: 5 },
      { label: '家族写真を見直す', next: 'act2_home_photos', timeCost: 8 },
      { label: '昔の自分の部屋を調べる', next: 'old_room_paper_memory', timeCost: 12, condition: { type: 'all', conditions: [{ type: 'knowledge', key: 'akano_yume_document' }, notFlag('old_room_paper_memory_done')] } },
      { label: '古いヘッドセットを手に取る', next: 'old_room_headset_memory', timeCost: 10, condition: { type: 'all', conditions: [{ type: 'knowledge', key: 'akano_yume_document' }, { type: 'selfMemory', key: 'old_web_creation' }, { type: 'selfMemory', key: 'escape_into_local_history' }, { type: 'flag', key: 'old_room_paper_memory_done' }, notFlag('mina_unlocked')] } },
      { label: '昔の部屋を見直す', next: 'old_room_repeat', timeCost: 5, condition: { type: 'flag', key: 'mina_unlocked' } },
      { label: '団地の廊下へ戻る', next: 'act2_hub' },
    ],
  },
  {
    id: 'mother_room_first', title: '母親の部屋・一回目', location: 'home', text: [
      '仕事の書類、日用品、老人の薬の一覧。清拭用品と介護用手袋も補充されている。',
      '古いメモの最初の頃には「仏間に入らない」とあった。その後、「奥さんの話」「線香」「話を聞く」と変わる。',
      'さらに後のページでは「赤い紙、要整理」「一人で持たない」という言葉が、介護メモの余白へ混じっていた。',
      'メモの日付は途切れていない。母さんは老人が死んだ後も、同じ生活の続きをしていた。だが記録の丁寧さは、それ以前から変わっていない。',
      '母さんは本当に老人を心配していた。善意だったから安全だった、とは言えない。それでも善意まで嘘にするのは違う。',
    ], choices: [{ label: '戻る', next: 'home_act2' }], effects: [{ type: 'addKnowledge', key: 'mother_care_was_sincere' }, { type: 'addKnowledge', key: 'mother_faith_internalization_path' }],
  },
  {
    id: 'mother_room_second', title: '母親の部屋・二回目', location: 'home', text: [
      '老人の死亡日を意識してメモを読み直す。帰宅後の欄にも「ゼリー」「薬」「洗濯」とある。',
      '介護用品を戻したとき、収納の奥に古い小箱が見えた。前にも視界には入っていたはずだ。母さんの昔の裁縫箱だろうか。',
      '目はすぐメモへ戻った。箱より、死亡後にも同じ記録が続いていることの方が気になった。',
    ], choices: [{ label: '戻る', next: 'home_act2' }], effects: [{ type: 'setFlag', key: 'old_box_noticed', value: true }],
  },
  {
    id: 'mother_room_third', title: '母親の部屋・三回目', location: 'home', text: [
      'また小箱が目に入った。',
      '……何でこれだけ、こんな奥にしまってある。',
      '木目の薄れた小さな裁縫箱だった。中には使いかけの糸、古いボタン、折り畳んだ紙。その下に見覚えのない鍵が一本ある。',
      'タグはない。何の鍵かは分からない。俺は元の場所へ戻さず、持っていくことにした。',
    ], choices: [{ label: '鍵を持って戻る', next: 'home_act2' }], effects: [{ type: 'addKnowledge', key: 'unidentified_old_key' }],
  },
  {
    id: 'mother_room_exhausted', title: '母親の部屋', location: 'home', text: [
      'もう目につくものは一通り見た。小箱もメモも、最初からここにあった。',
      '同じ場所を見続けて新しい意味を作り始める前に、いったん離れた方がいい。',
    ], choices: [{ label: '戻る', next: 'home_act2' }],
  },
  {
    id: 'act2_home_altar', title: '仏壇', location: 'home', text: [
      '父さんの写真を見る。死んだことに意味を付ける大人が嫌いだった。運命だった、見守っている、向こうで待っている。',
      '俺は言い返せなかった。ただ、意味のある言葉を全部嫌うことで逃げた。悲しいと言う代わりに、間違っていると考え続けた。',
    ], choices: [{ label: '戻る', next: 'home_act2' }], effects: [{ type: 'addSelfMemory', key: 'loss_father' }],
  },
  {
    id: 'act2_home_photos', title: '家族写真', location: 'home', variants: [{
      condition: { type: 'knowledge', key: 'library_jigaeshi_confirmed' },
      text: [
        '幼い俺の足元に赤い土がある。後ろには赤茶色の布。周囲の大人は土を囲み、子供の俺にも何かを持たせていた。',
        '図書館で見た地還しの記録と似ている。俺自身が参加していた可能性は高い。',
        'だが写真に「地還し」と書かれているわけではない。高い可能性と確定は違う。',
      ],
    }], text: [
      '幼い俺が赤っぽい土の上に立っている。背後には赤茶色の布。',
      '病院で聞いた風習に似ている。今朝赤い夢を見た俺が、赤だけを拾っている可能性も残る。',
    ], choices: [{ label: '戻る', next: 'home_act2' }], effects: [{ type: 'addKnowledge', key: 'possible_childhood_jigaeshi_participation' }],
  },
  {
    id: 'old_room_paper_memory', title: '昔の部屋', location: 'home', text: [
      '黄ばんだA4用紙の文字を思い浮かべながらHTML入門書を開く。余白に自分の字で「郷土」「団地」「赤い土」とある。',
      '昔、この地域のことを個人ホームページへ書いていた。そういう感触だけが戻った。父さんのいない家から離れたくて、家の外側に説明を探していた気がする。',
      'アカノユメを書いた、とは思い出せない。紙の文章と俺のページが同じだった証拠もない。',
    ], choices: [
      { label: '古いヘッドセットを手に取る', next: 'old_room_headset_memory' },
      { label: 'いったん戻る', next: 'home_act2' },
    ], effects: [
      { type: 'setFlag', key: 'old_room_paper_memory_done', value: true },
      { type: 'addSelfMemory', key: 'old_web_creation' },
      { type: 'addSelfMemory', key: 'escape_into_local_history' },
    ],
  },
  {
    id: 'old_room_headset_memory', title: '古いヘッドセット', location: 'home', text: [
      'ヘッドセットの硬いスポンジを指で押した。夜の部屋が、一瞬だけ今の部屋へ重なる。',
      '『まだ起きてる？』',
      '「そっちが二十三時からって言ったんだろ」',
      '『そうだっけ』',
      '笑う女性の声。リンクを直してくれた声と同じだ。胸の奥が不意に痛んだ。忘れていたことへの罪悪感が、名前を押し上げる。',
      '「…………ミナ」',
      '約二十年前、個人サイトを通じて知り合った。会ったことはない。それでも父さんを失った後の俺にとって、家の外と繋がる大切な相手だった。',
    ], choices: [
      { label: 'ミナへ今すぐ連絡する', next: 'mina_contact', timeCost: 12 },
      { label: '連絡先を探して戻る', next: 'home_act2' },
    ], effects: [
      { type: 'addSelfMemory', key: 'online_friend_mina' },
      { type: 'setFlag', key: 'mina_unlocked', value: true },
    ],
  },
  {
    id: 'old_room_repeat', title: '昔の部屋', location: 'home', text: [
      '古いPCはまだ動かせない。CD-Rも中身を読む準備が必要だ。今ここで分かることは増えそうにない。',
    ], choices: [{ label: '戻る', next: 'home_act2' }],
  },
  {
    id: 'neighbor_door', title: '隣室の前', location: 'housing_complex', text: [
      '見覚えのない鍵を鍵穴へ差し込んだ。抵抗なく奥まで入る。回すと小さく錠が外れた。',
      'ここで初めて、母さんの小箱にあったのが老人宅の鍵だと確定した。管理側から借りた物ではない。母さんが持っていた理由は分からない。',
      '無断で入ることへのためらいはある。だが母さんが今も出入りしているなら、安全を確認する必要がある。俺は扉を開けた。',
    ], next: 'neighbor_home_hub', effects: [
      { type: 'setFlag', key: 'neighbor_key_confirmed', value: true },
      { type: 'addKnowledge', key: 'key_opens_neighbor_apartment' },
    ],
  },
  {
    id: 'neighbor_home_hub', title: '老人宅', location: 'neighbor_apartment', text: [
      '古い県営住宅の、ごく普通の一室だった。台所には古い電気ケトル。寝室には洗濯物と薬。年金で暮らす一人の老人の生活が、そのまま止まっている。',
      '居間までは普通だ。奥の仏間だけ、閉じた襖の向こうから赤い紙の端が見えていた。',
    ], choices: [
      { label: '生活の痕跡を調べる', next: 'neighbor_life', timeCost: 12, condition: notFlag('neighbor_life_checked') },
      { label: '食事・介護用品を調べる', next: 'neighbor_care', timeCost: 12, condition: { type: 'all', conditions: [{ type: 'flag', key: 'neighbor_life_checked' }, notFlag('neighbor_care_checked')] } },
      { label: '仏間を調べる', next: 'neighbor_red_objects', timeCost: 12, condition: { type: 'all', conditions: [{ type: 'flag', key: 'neighbor_life_checked' }, notFlag('neighbor_red_checked')] } },
      { label: '黄ばんだA4を調べる', next: 'neighbor_old_paper', timeCost: 15, condition: { type: 'all', conditions: [{ type: 'flag', key: 'neighbor_red_checked' }, notFlag('neighbor_paper_checked')] } },
      { label: '前の事件を思い出す', next: 'neighbor_connect_incident', condition: { type: 'all', conditions: [{ type: 'flag', key: 'neighbor_paper_checked' }, { type: 'flag', key: 'neighbor_injury_rumor_heard' }, notFlag('neighbor_incident_connected')] } },
      { label: '仏間の外に同じ痕跡がないか確かめる', next: 'neighbor_late_boundary', timeCost: 8, condition: { type: 'all', conditions: [{ type: 'flag', key: 'neighbor_life_checked' }, { type: 'flag', key: 'neighbor_paper_checked' }, notFlag('neighbor_boundary_checked')] } },
      { label: '老人宅を出る', next: 'act2_hub' },
    ],
  },
  {
    id: 'neighbor_life', title: '生活の痕跡', location: 'neighbor_apartment', text: [
      '棚に若い夫婦の写真があった。女性の写真だけが後年の額にも入っている。妻を亡くしてから、長く一人で暮らしていたらしい。',
      'その横に子供世代の家族写真。さらに幼い子を抱いた写真がある。孫だろうか。ある年から先、新しい写真は増えていない。',
      '年賀状も同じ年で途切れていた。電話横の連絡先メモは古い番号のまま。誕生日や正月の新しい痕跡はない。',
      '擦り減った椅子、補修した眼鏡ケース、安い湯飲み。どれも誰かの生活が続いた跡だ。',
      '眼鏡ケースの縫い目は不揃いだった。自分で何度も縫い直したらしい。',
    ], choices: [
      { label: '奥の仏間を確かめる', next: 'neighbor_red_objects', timeCost: 12 },
      { label: '部屋を調べ続ける', next: 'neighbor_home_hub' },
    ], effects: [
      { type: 'setFlag', key: 'neighbor_life_checked', value: true },
      { type: 'addKnowledge', key: 'neighbor_long_widowhood' },
      { type: 'addKnowledge', key: 'neighbor_family_contact_ended' },
      { type: 'addKnowledge', key: 'neighbor_family_photo_gap' },
    ],
  },
  {
    id: 'neighbor_care', title: '食事・介護用品', location: 'neighbor_apartment', text: [
      '冷蔵庫に未開封のゼリーがある。表示された日付と母さんのメモを照らすと、老人の死亡後に持ち込まれた物だった。',
      '洗濯済みのタオルと新しい薬の仕分け袋もある。母さんが死亡後にもこの部屋へ来たことは間違いない。',
      'ゼリーは開いていない。薬も減っているようには見えない。誰かが食べ、飲んだ証拠にはならなかった。',
    ], choices: [{ label: '部屋を調べ続ける', next: 'neighbor_home_hub' }], effects: [
      { type: 'setFlag', key: 'neighbor_care_checked', value: true },
      { type: 'addKnowledge', key: 'postmortem_care_items' },
      { type: 'adjustHidden', key: 'FACT', amount: 1 },
    ],
  },
  {
    id: 'neighbor_red_objects', title: '仏間', location: 'neighbor_apartment', text: [
      '仏壇には亡くなった妻の遺影があった。異様なのは、その周囲だけだ。',
      '退色した赤布。赤い紐。赤鉛筆で書き込まれたコピー用紙。印刷方式も紙の色も違う。貼り直したテープ跡が、古い文字の上へ重なっている。',
      '同じ一文を何度も手書きした紙もあった。血の跡も刃物もない。一人の人間が何十年も手放せなかったものが、普通の仏間の中へ堆積していた。',
      '襖の奥に、何度も折られた黄ばんだA4が見える。',
    ], choices: [
      { label: '黄ばんだA4を調べる', next: 'neighbor_old_paper', timeCost: 15 },
      { label: '部屋を調べ続ける', next: 'neighbor_home_hub' },
    ], effects: [
      { type: 'setFlag', key: 'neighbor_red_checked', value: true },
      { type: 'addKnowledge', key: 'layered_red_objects' },
      { type: 'addKnowledge', key: 'butsuma_faith_accumulation' },
      { type: 'addKnowledge', key: 'neighbor_faith_kept_inside' },
    ],
  },
  {
    id: 'neighbor_old_paper', title: '古い紙', location: 'neighbor_apartment', text: [
      '引き出しの底に、何度も折られた黄ばんだA4用紙があった。折り目は薄くなり、裏からテープで補修されている。',
      '印刷はかすれていた。昔のWebページを印刷したものらしい。余白には赤鉛筆の書き込みがある。',
      '見出しに「アカノユメ」とあった。',
      '本文の多くは読めない。それでも一行だけ残っている。',
      '――家の痛みは、家の血で分ける。',
      '「一人で持ってはいけない」「赤いものを返す」「家族で分ける」。異なる時期の追記が、元の文字へ重なっている。',
      '秘密組織の配布物には見えない。老人自身か誰かがページを印刷し、何十年も読み返した紙だ。妻を早く亡くし、長く一人で暮らした老人にとって意味があったのかもしれない。救いだったのか、傷を深くしたのか。それも紙からは分からない。',
    ], choices: [{ label: '紙の内容を記録して戻る', next: 'neighbor_home_hub' }], effects: [
      { type: 'setFlag', key: 'neighbor_paper_checked', value: true },
      { type: 'addKnowledge', key: 'akano_yume_document' },
      { type: 'adjustHidden', key: 'FACT', amount: 1 },
    ],
  },
  {
    id: 'neighbor_connect_incident', title: '前の事件', location: 'neighbor_apartment', text: [
      '団地入口で聞いた、孫世代の親族の怪我。黄ばんだ紙には「家の痛みは、家の血で分ける」。',
      '「……まさか」',
      'それ以上は言葉にできなかった。事件は事実だ。この紙との因果を証明するものはない。',
    ], choices: [{ label: '部屋を調べ続ける', next: 'neighbor_home_hub' }], effects: [
      { type: 'setFlag', key: 'neighbor_incident_connected', value: true },
      { type: 'addKnowledge', key: 'neighbor_injury_faith_possible_link' },
    ],
  },
  {
    id: 'neighbor_late_boundary', title: '仏間の外', location: 'neighbor_apartment', text: [
      '妻の命日と、仏間で最も古い印刷物の時期は近い。インターネット黎明期の紙だ。老人が俺のページを直接読んだ証拠はない。すでに怪談めいた転載の一つへ触れたように見える。',
      '写真と年賀状は、家族との時間がある年を境に止まっている。仏間の紙は、それより後も増えていた。',
      '老人は信仰を捨てていない。一方で、県営住宅へ来てからそれを仏間の外へ広げた跡もない。',
      '母さんは血縁者ではない。老人は条件の外にいる母さんを傷つけなかった。そもそも、歩くだけで息が上がる身体で、誰かを押さえつける力は残っていなかっただろう。',
      'それだけではない。一度家族を失った人間が、また同じことをするのを恐れた。そう考えると、仏間の閉じ方には説明がつく。',
      '説明がつくだけだ。老人自身の言葉は、もう聞けない。',
    ], choices: [{ label: '部屋を調べ続ける', next: 'neighbor_home_hub' }], effects: [
      { type: 'setFlag', key: 'neighbor_boundary_checked', value: true },
      { type: 'addKnowledge', key: 'neighbor_faith_contained_after_loss' },
      { type: 'addKnowledge', key: 'mother_was_nonblood_and_neighbor_frail' },
      { type: 'addKnowledge', key: 'neighbor_early_recipient_after_wife_loss' },
      { type: 'adjustHidden', key: 'UNDERSTANDING', amount: 1 },
    ],
  },
  {
    id: 'library_hub', title: '市立図書館', location: 'library', text: [
      '郷土資料室の検索端末を開く。似た言葉でも、探し方によって出てくる資料は違う。',
    ], choices: [
      { label: '「赤い夢」で探す', next: 'library_red_dream', timeCost: 20, condition: notFlag('library_red_dream_done') },
      { label: '「地域の宗教」で探す', next: 'library_religion', timeCost: 35, condition: notFlag('library_religion_done') },
      { label: '「昔の地鎮祭」で探す', next: 'library_ground_rites', timeCost: 40, condition: notFlag('library_ground_rites_done') },
      { label: '「地還し」で詳しく探す', next: 'library_jigaeshi', timeCost: 50, condition: { type: 'all', conditions: [notFlag('library_jigaeshi_done'), { type: 'any', conditions: [{ type: 'knowledge', key: 'jigaeshi_meaning' }, { type: 'knowledge', key: 'local_custom_heard' }, { type: 'flag', key: 'jigaeshi_term_found' }] }] } },
      { label: '図書館を出る', next: 'act2_hub' },
    ],
  },
  {
    id: 'library_red_dream', title: '検索：赤い夢', location: 'library', text: [
      '夢占い、郷土文学、睡眠に関する本が並んだ。今朝の夢に似た記述はいくらでも見つかる。',
      '似たものが多すぎて、どれが関係するのか判断できない。検索語が広すぎた。',
    ], choices: [{ label: '検索を続ける', next: 'library_hub' }], effects: [{ type: 'setFlag', key: 'library_red_dream_done', value: true }],
  },
  {
    id: 'library_religion', title: '検索：地域の宗教', location: 'library', text: [
      '寺社、講、祭礼の資料は見つかった。赤を使う行事もあるが、アカノユメという名称はない。',
      '老人の紙を「宗教」と決めたのは早かったかもしれない。少なくとも組織や教団へつながる資料は見つからなかった。',
    ], choices: [{ label: '検索を続ける', next: 'library_hub' }], effects: [
      { type: 'setFlag', key: 'library_religion_done', value: true },
      { type: 'addKnowledge', key: 'no_akano_yume_in_religious_records' },
    ],
  },
  {
    id: 'library_ground_rites', title: '検索：昔の地鎮祭', location: 'library', text: [
      '土地を掘る前の行事をまとめた古い冊子が見つかった。赤い布、赤い紙、赤土。子供が土を返す写真もある。',
      '呼び方は家や地域で違い、「地還し」「地鎮さん」「土返し」と記録されていた。ようやく絞り込める言葉を一つ得た。',
      '血、剃刀、自傷の記録はない。俺の腕に起きたことを、この風習だけでは説明できない。',
    ], choices: [{ label: '検索を続ける', next: 'library_hub' }], effects: [
      { type: 'setFlag', key: 'library_ground_rites_done', value: true },
      { type: 'setFlag', key: 'jigaeshi_term_found', value: true },
      { type: 'addKnowledge', key: 'traditional_rite_has_no_self_harm' },
    ],
  },
  {
    id: 'library_jigaeshi', title: '検索：地還し', location: 'library', text: [
      '地域史の聞き取り記録に「地還し」があった。呼び名は地鎮さん、土返しなど一定しない。',
      '「土地から借りたものは、土地へ返す」',
      '「家の難儀は家で分ける」',
      '後者は家族の一人だけへ病気、介護、生活の負担を背負わせないための生活訓として説明されている。血も傷も必要としない。',
      '赤、家族、分ける、返す。母さんの言葉と似ている。だが血、傷、剃刀は資料にない。似ているが同じではない。',
      'そして古い資料のどこにも「アカノユメ」という名称はなかった。地還しとアカノユメを同じものにはできない。',
      'ページを閉じたとき、昔の俺もこの資料を読んだ気がした。父さんの死を家の中で考え続けるのが嫌で、地域の古い話へ逃げ込んだ。そんな感触だけが残った。',
    ], choices: [{ label: '調査内容を記録する', next: 'library_hub' }], effects: [
      { type: 'setFlag', key: 'library_jigaeshi_done', value: true },
      { type: 'addKnowledge', key: 'library_jigaeshi_confirmed' },
      { type: 'addKnowledge', key: 'jigaeshi_not_akano_yume' },
      { type: 'addSelfMemory', key: 'escape_into_local_history' },
      { type: 'adjustHidden', key: 'UNDERSTANDING', amount: 1 },
    ],
  },
  {
    id: 'mina_contact', title: 'ミナ', text: [
      '古いメールアドレスから、今も使われている連絡先を一つ見つけた。短い文章を何度も書き直す。',
      '「変なこと聞いていいか。アカノユメって覚えてる？」',
      'しばらくして返信が来た。',
      '『……懐かしい名前出すね』',
      '「知ってることを聞きたい」',
      '『私も全部知ってたわけじゃないよ。昔のあんたが集めてた話でしょ。今、何があったの？』',
      '指が止まった。昔の俺が集めていた。それは作者だったという意味ではない。聞きたいことが、さらに増えた。',
    ], choices: [{ label: '事情は後で話すと伝える', next: 'act2_hub' }], effects: [
      { type: 'setFlag', key: 'mina_contacted', value: true },
      { type: 'addKnowledge', key: 'mina_remembers_akano_yume' },
    ],
  },
  {
    id: 'work_call_1600', title: '16:00　勤務先からの電話', text: [
      '『お疲れさまです。今日の授業ですが、予定どおり来られそうですか？』',
      '塾の事務員の声だった。朝の俺は、夕方から仕事へ行くつもりでいた。腕を隠す服まで考えていた。',
      '腕の傷。死亡した隣人。それでも会ったと言う母さん。調べるうちに、普通の一日の優先順位から仕事が外れていた。',
    ], choices: [{ label: 'それどころではない', next: 'act3_opening', effects: [{ type: 'setFlag', key: 'work_call_done', value: true }] }],
  },
]

