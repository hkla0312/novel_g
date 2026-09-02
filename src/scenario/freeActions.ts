import type { Condition, ScenarioNode } from '../types/scenario'

const canReturn: Condition = {
  type: 'any', conditions: [
    { type: 'all', conditions: [{ type: 'flag', key: 'hospital_done' }, { type: 'flag', key: 'police_done' }] },
    { type: 'all', conditions: [{ type: 'flag', key: 'hospital_done' }, { type: 'flag', key: 'home_done' }] },
    { type: 'all', conditions: [{ type: 'flag', key: 'police_done' }, { type: 'flag', key: 'home_done' }] },
  ],
}

export const freeActionNodes: ScenarioNode[] = [
  {
    id: 'free_action_hub', title: '自由行動', text: [
      '母さんが出勤した後の部屋は静かだった。壁の時計と、冷蔵庫の作動音だけが聞こえる。',
    ], choices: [
      { label: '病院へ行く', next: 'hospital', timeCost: 12, condition: { type: 'not', condition: { type: 'flag', key: 'hospital_done' } } },
      { label: '警察へ行く', next: 'police', timeCost: 12, condition: { type: 'not', condition: { type: 'flag', key: 'police_done' } } },
      { label: '自宅を調べる', next: 'home_search', timeCost: 2 },
      { label: '団地の入り口へ戻る', next: 'danchi_return', condition: canReturn },
    ],
  },
  {
    id: 'hospital', title: '病院', location: 'hospital', timeCost: 35, text: [
      '医師は傷を洗浄し、一本ずつ確認した。',
      '「幸い、どれも浅いです。化膿と破傷風には気をつけてください」',
      '原因を聞かれ、家族にやられた可能性があると答えた。医師は一瞬手を止め、声を落とした。',
      '「今夜、安全に眠れる場所はありますか。警察への相談は？」',
      '処置を終えた待合室で、高齢の男女が昔の土地の話をしていた。家を建てる前に「地鎮さん」をした、いやあれは「地還し」だ、と名称で揉めている。',
      '赤い布、赤い紙、赤い土。土地を掘るときや大きく変えるとき、子供も一緒に参加したという。血や傷の話は一度も出ない。',
    ], choices: [
      { label: '高齢者に話しかける', next: 'hospital_elder', timeCost: 8 },
      { label: '病院を出る', next: 'free_action_hub', effects: [{ type: 'setFlag', key: 'hospital_done', value: true }] },
    ], effects: [{ type: 'addKnowledge', key: 'local_custom_heard' }, { type: 'adjustHidden', key: 'FACT', amount: 1 }],
  },
  {
    id: 'hospital_elder', title: '待合室', location: 'hospital', text: [
      '尋ねると、二人は少し意外そうにしながら説明してくれた。呼び名も道具も、地域どころか家ごとに違ったらしい。',
      '「土地から借りたものは土地へ返す、ってな」',
      '「家の難儀は家で分ける、とも言ったねえ。一人に介護も病気も背負わせるなってことよ」',
      '家族の誰か一人へ介護も病気も背負わせない。その言葉自体は、ごく普通の生活の話に聞こえた。剃刀も、傷も出てこない。',
      'もっと調べるなら市立図書館の郷土資料にあるかもしれない、と教えられた。',
    ], choices: [{ label: '礼を言って病院を出る', next: 'free_action_hub', effects: [{ type: 'setFlag', key: 'hospital_done', value: true }, { type: 'addKnowledge', key: 'jigaeshi_meaning' }, { type: 'setFlag', key: 'library_lead', value: true }] }],
  },
  {
    id: 'police', title: '警察署', location: 'police', timeCost: 30, text: [
      '担当の警察官は腕の写真を撮り、残っていた刃をどう保管したか確認した。今夜安全に眠れる場所、母さんと距離を置けるか、妹にも危険がないか。必要なら避難先や被害届について案内するという。',
      '俺は隣人が怪しいのかもしれない、母さんは宗教のようなものに関わったのかもしれない、と説明しかけた。口にすると、どれも推測の形しかしていなかった。',
      '「それは現時点では推測ですね。確認できていることと分けましょう」',
      '冷たい言い方ではなかった。警察官は俺が実際に見たこと、母さんから聞いたこと、それ以外を順に確認した。母さんの職場へ所在確認をしてよいか尋ねられ、了承した。',
    ], choices: [{ label: '警察署を出る', next: 'police_call', effects: [{ type: 'setFlag', key: 'police_done', value: true }, { type: 'setFlag', key: 'police_consulted', value: true }] }],
  },
  {
    id: 'police_call', title: '母からの電話', timeCost: 4, text: [
      '外へ出たところで母さんから電話が来た。',
      '「警察に何話したの？」',
      '背中が冷えた。なぜ知っている。そう思った直後、母さんが「職場に電話が来た」と続けた。警察が所在を確認した電話だった。',
      '「家のことを外へ出したら駄目。外へ持っていったら、また戻ってくるでしょう」',
      '何が戻るのか尋ねても、母さんは仕事中だからと電話を切った。普通の理由が分かった後にも、言葉だけが残った。',
    ], next: 'free_action_hub', effects: [{ type: 'addKnowledge', key: 'mother_externalization_fear' }],
  },
  {
    id: 'home_search', title: '自宅を調べる', location: 'home', text: [
      '母さんのいない実家を調べることに、後ろめたさがあった。傷がなければしなかっただろう。だが傷はある。何も見なかったことにはできない。',
    ], choices: [
      { label: '仏壇を見る', next: 'home_altar', timeCost: 5 },
      { label: '母親の周辺を調べる', next: 'home_mother_notes', timeCost: 18, condition: { type: 'not', condition: { type: 'flag', key: 'mother_room_first_done' } }, effects: [{ type: 'setFlag', key: 'mother_room_first_done', value: true }, { type: 'adjustHidden', key: 'motherRoomSearchCount', amount: 1 }] },
      { label: '家族写真を見る', next: 'home_photos', timeCost: 6 },
      { label: '昔の自分の部屋を調べる', next: 'home_old_room', timeCost: 8 },
      { label: '探索を切り上げる', next: 'free_action_hub', effects: [{ type: 'setFlag', key: 'home_done', value: true }] },
    ],
  },
  {
    id: 'home_altar', title: '仏壇', location: 'home', text: [
      '仏壇には、若い父さんの写真がある。俺が幼い頃に死んだ。周りの大人は「見守っている」「運命だった」「向こうで待っている」と言った。',
      '子供の俺は、その言葉が嫌いだった。死んだことを、残された人間が勝手に意味のあることへ変えるな。そう思っていた。',
      '引き出しの奥に、古い赤茶色の布が畳まれていた。血の跡には見えない。用途は分からない。',
    ], choices: [{ label: '戻る', next: 'home_search' }], effects: [{ type: 'addKnowledge', key: 'red_brown_cloth' }, { type: 'addSelfMemory', key: 'loss_father' }],
  },
  {
    id: 'home_mother_notes', title: '母親のメモ', location: 'home', text: [
      '母さんの部屋には仕事の書類、化粧品、読みかけの文庫本がある。どれも見慣れた生活の物だ。',
      '机のメモ帳には、隣人の食事、薬、洗濯、ゴミ出しの日が細かく書かれていた。',
      '「塩分少なめ」「ゼリーなら食べる」「毛布、次回洗う」',
      '押し入れには介護用の手袋と未開封の清拭用品まで揃っている。母さんは本気で老人を心配し、真面目に世話をしていた。',
      '善意があったことと、俺の腕を傷つけたことは両立する。片方で片方を消してはいけない。',
    ], choices: [{ label: '戻る', next: 'home_search' }], effects: [{ type: 'addKnowledge', key: 'mother_care_notes' }],
  },
  {
    id: 'home_photos', title: '家族写真', location: 'home', text: [
      '父さんが生きていた頃は四人。死んだ後は三人。並べると、写真から一人分の重さが抜けている。',
      '俺は父親を失った。でも母さんは夫を失ったんだ。その当たり前を、俺は自分の喪失の外側へ置いたまま大人になった。',
      '古い一枚に、幼い俺が写っている。足元は赤っぽい土で、背後に布が渡されていた。工事現場の行事だろうか。',
    ], variants: [{
      condition: { type: 'knowledge', key: 'jigaeshi_meaning' },
      text: [
        '父さんがいた頃の四人家族と、死後の三人家族。俺は父親を失った。母さんは夫を失った。その違いを、初めて同じ写真の中で考えた。',
        '幼い俺が赤い土の上に立つ写真。背後には赤茶色の布。病院で聞いた「地還し」の道具と一致する。',
        '赤い土の上で、幼い俺は大人に手を添えられ、何かを地面へ返そうとしていた。',
      ],
    }], choices: [{ label: '戻る', next: 'home_search' }], effects: [{ type: 'addKnowledge', key: 'childhood_red_land_photo' }, { type: 'addSelfMemory', key: 'mother_lost_husband' }],
  },
  {
    id: 'home_old_room', title: '昔の部屋', location: 'home', text: [
      '古いHTML入門書、CD-R、黄ばんだLANケーブル、デスクトップPC。俺は個人ホームページを作っていたらしい。自分のことなのに、細部が抜け落ちている。',
      '古いヘッドセットを持ち上げた瞬間、記憶とも想像ともつかない声が浮かんだ。',
      '――それ、リンク間違ってるよ。',
      '女性の声。名前は出てこない。PCは電源ケーブルも外され、今すぐ中身を確かめられる状態ではなかった。',
    ], choices: [{ label: '戻る', next: 'home_search' }], effects: [{ type: 'addSelfMemory', key: 'old_web_creation' }, { type: 'addKnowledge', key: 'old_pc_exists' }, { type: 'adjustHidden', key: 'SELF', amount: 1 }],
  },
  {
    id: 'danchi_return', title: '団地', location: 'housing_complex', timeCost: 15, text: [
      '団地へ戻ると、入口の植え込みで年配の女性に声をかけられた。子供の頃、何度か菓子をもらった近所の人だ。',
      '「まあ、大きくなって。お母さん、元気に働いてる？」',
      '天気と仕事と、昔の商店街の話をした。普通の立ち話だった。だから俺も、隣の老人について何気なく尋ねた。',
    ], choices: [
      { label: '前の住居での話を聞く', next: 'danchi_injury_rumor', timeCost: 5 },
      { label: '最近の様子だけを聞く', next: 'danchi_death_reveal' },
    ],
  },
  {
    id: 'danchi_injury_rumor', title: '団地入口の噂', location: 'housing_complex', text: [
      '「前のところでも、ちょっとあったらしいのよ」',
      '「家族と揉めたとか？」',
      '「孫だったかなあ。怪我させたって話は聞いたことある。警察も来たけど、身内のことで大事にはならなかったとか」',
      '「それで前のところにいづらくなって、こっちの県営住宅に来たんじゃなかったかな。まあ、噂だけどね」',
      '女性は老人を責める口調ではなかった。話の年代も、孫だということさえ曖昧だった。',
    ], next: 'danchi_death_reveal', effects: [
      { type: 'addKnowledge', key: 'neighbor_injury_rumor' },
      { type: 'setFlag', key: 'neighbor_injury_rumor_heard', value: true },
    ],
  },
  {
    id: 'danchi_death_reveal', title: '団地入口', location: 'housing_complex', text: [
      '女性は老人の最近の様子を思い出そうとして、首を傾げた。',
      '「亡くなったでしょう？」',
      '「……え？」',
      '「何日か前よ。あなたが帰ってくる前」',
    ], next: 'neighbor_fact', effects: [
      { type: 'addKnowledge', key: 'neighbor_dead' },
      { type: 'setFlag', key: 'neighbor_death_revealed', value: true },
      { type: 'adjustHidden', key: 'FACT', amount: 2 },
    ],
  },
  {
    id: 'neighbor_fact', location: 'housing_complex', text: [
      '老人が亡くなったというのは、俺が帰省する前のことらしい。母さんは昨日も会ったと言っていた。',
      '母さんは昨日も会ったと言っていた。近所の女性は、その数日前に亡くなったと言う。',
      '口の中が乾いた。電話をかける指が、傷とは別の理由で震えた。',
    ], choices: [{ label: '母さんへ電話する', next: 'final_call', timeCost: 10 }],
  },
  {
    id: 'final_call', title: '母への確認', text: [
      '「昨日、おじいさんのところ行った？」',
      '『行ったよ』',
      '「会った？」',
      '『会ったって、そりゃ会うでしょう』',
      '「話した？」',
      '『話したわよ。今日はあまり食べたくないって。だからゼリーを置いてきたの』',
      '母さんの声に迷いはなかった。作り話を考えている間も、俺を脅そうとする響きもない。いつもの母さんが、昨日の出来事を説明している。',
      '「おじいさん、死んでるって聞いたんだけど」',
      '短い沈黙があった。',
      '『何言ってるの？　昨日会ったって言ったでしょう。生きてる人を死んだなんて言うもんじゃないよ』',
      '俺は返事ができなかった。嘘をついている声には聞こえない。だが近所の女性の話も、聞き違いとして片づけるには具体的だった。',
      '二つの証言が、同じ場所に重ならずに存在していた。',
    ], next: 'act2_opening', effects: [{ type: 'setFlag', key: 'mother_death_questioned', value: true }, { type: 'addKnowledge', key: 'mother_claims_postmortem_contact' }],
  },
]

