import type { Condition, ScenarioNode } from '../types/scenario'

const flag = (key: string): Condition => ({ type: 'flag', key })
const knowledge = (key: string): Condition => ({ type: 'knowledge', key })
const notFlag = (key: string): Condition => ({ type: 'not', condition: flag(key) })

const trueRequirements: Condition = { type: 'all', conditions: [
  flag('author_revealed'), knowledge('library_jigaeshi_confirmed'), knowledge('neighbor_long_widowhood'),
  flag('brother_understood'), flag('mother_accompanied'), flag('mother_empathy_spoken'),
  { type: 'collectionCount', collection: 'selfMemory', atLeast: 3 },
  { type: 'hidden', key: 'UNDERSTANDING', atLeast: 3 },
] }

const normalRequirements: Condition = { type: 'all', conditions: [
  flag('author_revealed'), { type: 'collectionCount', collection: 'selfMemory', atLeast: 3 },
] }

const secretRequirements: Condition = { type: 'all', conditions: [
  flag('true_cleared_previous'), flag('mina_contacted'), flag('mina_deepened'), flag('original_pages_recovered'),
  knowledge('library_jigaeshi_confirmed'), knowledge('neighbor_long_widowhood'), flag('brother_understood'),
] }

export const act3to5Nodes: ScenarioNode[] = [
  {
    id: 'act3_opening', title: 'ACT 3　残った言葉', location: 'home', variants: [
      { condition: { type: 'all', conditions: [knowledge('library_jigaeshi_confirmed'), knowledge('akano_yume_document')] }, text: [
        '仕事を休むと伝えた。電話を切ると、部屋の静けさが戻った。',
        '図書館で確認した風習と、老人宅の紙。似た言葉はある。それでも、同じものとするには差が大きすぎる。',
        '俺の昔のPCに、その差を埋めるものがあるかもしれない。',
      ] },
      { condition: knowledge('akano_yume_document'), text: [
        '仕事を休むと伝えた。電話を切ると、部屋の静けさが戻った。',
        '老人宅で見つけた紙が、どこから来たのかは分からない。',
        '俺の昔のPCに、確かめられるものがあるかもしれない。',
      ] },
      { condition: { type: 'all', conditions: [knowledge('library_jigaeshi_confirmed'), { type: 'any', conditions: [knowledge('akano_yume_name_from_brother'), knowledge('akano_yume_document')] }] }, text: [
        '仕事を休むと伝えた。電話を切ると、部屋の静けさが戻った。',
        '図書館で確認した風習と、母さんの言葉には似た部分がある。血や傷まで説明する資料はなかった。',
        '俺の昔のPCに、この町を調べていた頃の記録があるかもしれない。',
      ] },
    ], text: [
      '仕事を休むと伝えた。電話を切ると、部屋の静けさが戻った。',
      '分かったのは、母さんの認識と老人の死が食い違っていることだけだ。',
      '昔のPCに、この家や町について書いた記録が残っているかもしれない。',
    ], next: 'act3_hub',
  },
  {
    id: 'act3_hub', title: '残った資料', location: 'home', variants: [
      { condition: { type: 'all', conditions: [knowledge('library_jigaeshi_confirmed'), knowledge('akano_yume_document')] }, text: ['黄ばんだ紙の写真と、図書館で書き写した記録を並べる。比べるか、PCへ進むか。'] },
      { condition: knowledge('akano_yume_document'), text: ['黄ばんだ紙の写真を見直す。出所を探すなら、昔のPCを確かめるしかない。'] },
      { condition: knowledge('library_jigaeshi_confirmed'), text: ['図書館で書き写した地域資料を机へ置く。昔のPCに、自分が何を調べていたか残っているかもしれない。'] },
    ], text: [
      '今ある事実だけでは、母さんの言葉の出所は分からない。昔のPCを確かめる。',
    ], choices: [
      { label: '地還しと古い紙を比べる', next: 'compare_custom_and_paper', timeCost: 15, condition: { type: 'all', conditions: [knowledge('library_jigaeshi_confirmed'), knowledge('akano_yume_document'), notFlag('custom_compared')] } },
      { label: 'ミナへ古い紙の写真を送る', next: 'mina_deep_contact', timeCost: 10, condition: { type: 'all', conditions: [flag('mina_contacted'), notFlag('mina_deepened')] } },
      { label: '古いPCを起動する', next: 'old_pc_start' },
    ],
  },
  {
    id: 'compare_custom_and_paper', title: '似ている言葉', text: [
      '地還しの記録は「家の難儀は家で分ける」。紙は「家の痛みは、家の血で分ける」。',
      '難儀が痛みになり、家が血になっている。赤い布は残ったが、継ぎ足された血と刃物は古い資料にない。',
      '一度の改変ではないのかもしれない。誰かが少し言い換え、次の誰かがまた読み足した。その方が、紙の古さには合っている。',
    ], choices: [{ label: '比較を記録する', next: 'act3_hub' }], effects: [
      { type: 'setFlag', key: 'custom_compared', value: true },
      { type: 'addKnowledge', key: 'interpretation_drift_chain' },
      { type: 'adjustHidden', key: 'UNDERSTANDING', amount: 1 },
    ],
  },
  {
    id: 'mina_deep_contact', title: 'ミナと古いページ', text: [
      '紙の写真を送ると、ミナから通話がかかってきた。',
      '『これ、元のページじゃないよ。フォントもリンクも違う』',
      '「コピーか」',
      '『たぶん。昔はHTMLごとコピーして、文章を足す人もいたから』',
      '『「アカノユメ」って名前も、あんたのページにはなかったと思う。外の掲示板で呼ばれ始めたんじゃないかな』',
      '「元の文章、覚えてるか」',
      '『はっきりは。でも、血とか刃物とか、そんなのはなかったと思う』',
      'ミナも答えを持ってはいない。ただ、この紙が最初ではないことだけは強くなった。',
    ], choices: [{ label: 'PCを確かめる', next: 'act3_hub' }], effects: [
      { type: 'setFlag', key: 'mina_deepened', value: true },
      { type: 'addKnowledge', key: 'copied_html_changed_over_time' },
      { type: 'adjustHidden', key: 'UNDERSTANDING', amount: 1 },
    ],
  },
  {
    id: 'old_pc_start', title: 'ACT 4　自分の過去', location: 'old_room', text: [
      '押し入れの古いPCを机に置いた。電源ケーブルを挿し、ボタンを押す。',
      'ファンが鳴った。二度止まりそうになり、それでも古いデスクトップが表示された。',
      '呆気ないほど普通だった。勝手に開くファイルも、警告もない。「site_old」というフォルダがある。',
    ], variants: [
      { condition: knowledge('old_pc_exists'), text: [
        '押し入れで確認した古いPCを机に置いた。電源ケーブルを挿し、ボタンを押す。',
        'ファンが鳴った。二度止まりそうになり、それでも古いデスクトップが表示された。',
        '「site_old」というフォルダがある。',
      ] },
      { condition: { type: 'selfMemory', key: 'old_web_creation' }, text: [
        'HTML入門書の奥を改めて探し、古いPC本体を引き出した。',
        '電源を入れると、古いデスクトップが起動した。「site_old」というフォルダが残っている。',
      ] },
    ], next: 'pc_index',
  },
  {
    id: 'pc_index', title: 'index.html', text: [
      'ブラウザに、灰色の背景と青いリンクが出た。「この町の古い話」。',
      '下手な文章だった。一文が長く、同じ言葉を何度も使っている。それでも、書き方に覚えがあった。',
      'ページ末の名前は、幼い頃の俺が名乗っていたハンドルネームだった。',
    ], next: 'pc_about', effects: [{ type: 'addSelfMemory', key: 'old_web_creation' }],
  },
  {
    id: 'pc_about', title: 'about.html', text: [
      '「俺は神様とかおまじないは信じてない」と書いてある。笑えない。父さんの死に意味を付ける大人へ、俺が心の中で繰り返した文句だった。',
      'その後に「こういう話を知ったら、少し楽になる人もいるかもしれない」と続く。',
      '信じたくない。でも、誰かを助けたい。子供の俺は、その矛盾ごとページにした。',
    ], next: 'pc_town', effects: [{ type: 'addSelfMemory', key: 'loss_father' }, { type: 'adjustHidden', key: 'SELF', amount: 1 }],
  },
  {
    id: 'pc_town', title: 'town.html', text: [
      '地還しの写真が、低い解像度で貼られていた。図書館の資料から引いた文もある。',
      '「家の難儀は家で分ける。一人に全部を持たせない」',
      '血も刃物もない。地還し、赤土、赤布、赤紙、子供も参加すること。寝苦しい夜に赤い夢を見ることがある、と自分の経験まで添えていた。',
      '俺の夢は、幼い頃の赤土と、大人に腕を持たれた感覚の繰り返しだ。このページより前から見ている。',
    ], next: 'pc_aka', effects: [{ type: 'addKnowledge', key: 'original_harmless_ritual' }],
  },
  {
    id: 'pc_aka', title: 'memo.html', variants: [
      { condition: { type: 'all', conditions: [flag('mina_contacted'), knowledge('library_jigaeshi_confirmed'), knowledge('akano_yume_document')] }, text: [
        'ページの見出しは「赤い土の話」。「アカノユメ」という名前はどこにもない。図書館で見た地還しの記録と、言葉の並びが一致している。',
        '老人の紙では「家の痛みは、家の血で分ける」。ここでは「家の難儀は、家の人で分ける」だった。血も刃物もない。',
        '当時使っていたメールソフトを開くと、ミナからの古いメールが残っていた。「リンク先、ここじゃないよ」。修正箇所とHTMLの書き方が、その下に続いている。',
        '画面の文章も、ハンドルネームも覚えている。ここまで作った夜のことを、俺は知っていた。',
      ] },
      { condition: { type: 'all', conditions: [knowledge('library_jigaeshi_confirmed'), knowledge('akano_yume_name_from_brother')] }, text: [
        'ページの見出しは「赤い土の話」。「アカノユメ」という名前はどこにもない。図書館で見た地還しの記録と、言葉の並びが一致している。',
        'ここでは「家の難儀は、家の人で分ける」だった。血も刃物もない。',
        '当時使っていたメールソフトには、サイトのリンクとHTMLの直し方を伝える古いメールが残っていた。「リンク先、ここじゃないよ」。',
        '画面の文章も、ハンドルネームも覚えている。ここまで作った夜のことを、俺は知っていた。',
      ] },
      { condition: knowledge('library_jigaeshi_confirmed'), text: [
        'ページの見出しは「赤い土の話」。図書館で見た地還しの記録と、言葉の並びが一致している。',
        'ここでは「家の難儀は、家の人で分ける」だった。血も刃物もない。',
        '当時使っていたメールソフトには、サイトのリンクとHTMLの直し方を伝える古いメールが残っていた。「リンク先、ここじゃないよ」。',
        '画面の文章も、ハンドルネームも覚えている。ここまで作った夜のことを、俺は知っていた。',
      ] },
      { condition: knowledge('akano_yume_document'), text: [
        'ページの見出しは「赤い土の話」。「アカノユメ」という名前はどこにもない。',
        '黄ばんだA4と同じ文の骨組みがある。ただし、ここでは「家の難儀は、家の人で分ける」だった。紙にあった血と傷の意味は見つからない。',
        '当時使っていたメールソフトには、サイトのリンクとHTMLの直し方を伝える古いメールが残っていた。「リンク先、ここじゃないよ」。',
        '画面の文章も、ハンドルネームも覚えている。ここまで作った夜のことを、俺は知っていた。',
      ] },
    ], text: [
      'ページの見出しは「赤い土の話」だった。',
      '「家の難儀は、家の人で分ける」とある。血や刃物の話はない。',
      '当時使っていたメールソフトには、サイトのリンクとHTMLの直し方を伝える古いメールが残っていた。「リンク先、ここじゃないよ」。',
      'キーボードへ置いた手のひらが湿っている。画面の文章も、ハンドルネームも覚えていた。ここまで作った夜のことを、俺は知っていた。',
    ], next: 'author_reveal',
  },
  {
    id: 'author_reveal', title: '原点', variants: [
      { condition: knowledge('copied_html_changed_over_time'), text: [
        'ミナが指摘した転載ページと、このローカルHTMLは違う。後で「アカノユメ」と呼ばれたものを、俺がそのまま作ったわけではない。',
        'それでも、変形される前の言葉を書いた人間は、今この画面を見ている。', '「……俺だ。」',
      ] },
      { condition: knowledge('akano_yume_document'), text: [
        '黄ばんだ紙と、このページは同じではない。アカノユメそのものを、俺が作ったわけではない。',
        'それでも、紙に残った言葉の元を書いた人間は、今この画面を見ている。', '「……俺だ。」',
      ] },
    ], text: [
      'このローカルHTMLを書いた人間は、今この画面を見ている。',
      '地域の風習を、自分なりの言葉で誰かへ渡そうとした。その意図が正しかったかどうかは、まだ分からない。',
      '「……俺だ。」',
    ], next: 'brother_call', effects: [
      { type: 'setFlag', key: 'author_revealed', value: true },
      { type: 'setFlag', key: 'original_pages_recovered', value: true },
      { type: 'addKnowledge', key: 'original_site_author' },
      { type: 'addKnowledge', key: 'source_site_not_akano_yume' },
      { type: 'adjustHidden', key: 'FACT', amount: 2 },
      { type: 'adjustHidden', key: 'SELF', amount: 2 },
    ],
  },
  {
    id: 'brother_call', title: '義弟', variants: [{ condition: { type: 'visitedNode', id: 'brother_initial_call' }, text: [
      '妹の夫へもう一度電話した。老人宅で紙を見て、同じ名前の文章が少しずつ違う形で外にもあると知ったという。赤い夢の記述も読んだ。',
      '義弟に地還しの記憶はない。彼が赤い夢を見始めたのは、老人宅でその言葉を読んだ後だ。知った内容が夢の形を与えたと考えれば、それだけで説明はつく。',
      '『全部が間違ってるわけじゃないと思うんです』',
      '「元の言葉を書いたのは俺だ。でも、その名前も、お前が読んだ形も俺のページにはない」',
      '『お義兄さんがどういうつもりで書いたかなんて、関係ないです。俺があれを読んだとき、お義兄さんはそこにいなかった』',
      '声は怒っているというより、追い詰められていた。',
      '『全部信じてるわけじゃないです。でも、あれで少し楽になった。それも間違いだったって言うんですか』',
    ] }], text: [
      '妹の夫へ電話した。老人宅で見た文章について、義弟はしばらく黙っていた。',
      '『……お義兄さん。アカノユメって、知っていますか』',
      '同じ名前の文章が少しずつ違う形で外にもあり、赤い夢について書かれたものもあるという。義弟自身も最近、赤い夢を見た。',
      '『全部が間違ってるわけじゃないと思うんです』',
      '「元の言葉を書いたのは俺だ。でも、その名前も、お前が読んだ形も俺のページにはない」',
      '『お義兄さんがどういうつもりで書いたかなんて、関係ないです。俺があれを読んだとき、お義兄さんはそこにいなかった』',
      '声は怒っているというより、追い詰められていた。',
      '『全部信じてるわけじゃないです。でも、あれで少し楽になった。それも間違いだったって言うんですか』',
    ], choices: [
      { label: '何言ってんだ、お前', next: 'brother_reject' },
      { label: '母さんに何を言われた？', next: 'brother_information' },
      { label: 'どこが間違ってないと思った？', next: 'brother_understand' },
    ], effects: [{ type: 'addKnowledge', key: 'brother_red_dream' }, { type: 'addKnowledge', key: 'akano_yume_name_from_brother' }],
  },
  {
    id: 'brother_reject', text: [
      '「何言ってんだ、お前。あの文章で母さんは人を傷つけたんだぞ」',
      '『……そうですか』',
      '義弟はそれ以上話さなかった。間違ったことを止めるためには、それで十分だと思った。',
    ], next: 'mother_returns_evening', effects: [{ type: 'setFlag', key: 'brother_rejected', value: true }],
  },
  {
    id: 'brother_information', text: [
      '「母さんに何を言われた？」',
      '『別に。紙を見つけて、俺が勝手に読んだんです。老人にも、お義母さんにも勧められてません』',
      '仕事を失う不安。妹を支えられないかもしれない恐怖。彼は事実を話したが、どの言葉が彼を支えたのかは言わなかった。',
    ], next: 'mother_returns_evening', effects: [{ type: 'setFlag', key: 'brother_questioned', value: true }, { type: 'adjustHidden', key: 'FACT', amount: 1 }],
  },
  {
    id: 'brother_understand', text: [
      '「どこが間違ってないと思った？」',
      '長い沈黙の後、義弟が息を吐いた。',
      '『……一人で全部抱えなくていいってところです』',
      '仕事の不安も、妹を支える責任も、自分に価値がないという思いも、彼は一人で抱えていた。',
      '「あれを読んで楽になったなら、そこまで嘘だったことにはできない」',
      '口にしてから、腕の傷が痛んだ。楽にする言葉と、人を傷つける行為は、同じにはできない。',
    ], next: 'mother_returns_evening', effects: [
      { type: 'setFlag', key: 'brother_understood', value: true },
      { type: 'addKnowledge', key: 'words_helped_brother' },
      { type: 'adjustHidden', key: 'UNDERSTANDING', amount: 2 },
    ],
  },
  {
    id: 'mother_returns_evening', title: 'ACT 5　母が帰ってくる', location: 'home', audio: { bgm: 'main-investigation', fadeMs: 1200, bgmVolumeScale: .58 }, text: [
      '玄関の鍵が回った。',
      '「ただいまー」',
      '母さんは買い物袋を両手に下げ、いつもの声で帰ってきた。俺の腕を見て、心配そうに顔を曇らせる。',
      '「腕、大丈夫だった？」',
      '「応急処置はした」',
      '「そう……無理しないでね」',
      'それから母さんは豆腐を冷蔵庫へ入れ、惣菜を皿へ移した。半分だけ別の容器によそう。',
      '「それ、何」',
      '「おじいちゃんの。ちょっと行ってくるね」',
    ], variants: [{ condition: flag('hospital_done'), text: [
      '玄関の鍵が回った。', '「ただいまー」',
      '母さんは買い物袋を両手に下げ、いつもの声で帰ってきた。俺の腕を見て、心配そうに顔を曇らせる。',
      '「腕、大丈夫だった？」', '「病院で処置した」', '「そう。良かった」',
      'それから母さんは豆腐を冷蔵庫へ入れ、惣菜を皿へ移した。半分だけ別の容器によそう。', '「それ、何」', '「おじいちゃんの。ちょっと行ってくるね」',
    ] }], choices: [
      { label: '止める', next: 'mother_stop' },
      { label: '一緒に行って、母さんの話を聞く', next: 'mother_go_together', condition: { type: 'all', conditions: [knowledge('neighbor_long_widowhood'), { type: 'collectionCount', collection: 'selfMemory', atLeast: 3 }] } },
      { label: '一緒に行く', next: 'mother_go_together', condition: { type: 'not', condition: { type: 'all', conditions: [knowledge('neighbor_long_widowhood'), { type: 'collectionCount', collection: 'selfMemory', atLeast: 3 }] } } },
      { label: '黙って見送る', next: 'mother_let_go' },
      { label: '老人が死んでいることを伝える', next: 'mother_tell_death' },
    ],
  },
  {
    id: 'mother_stop', text: [
      '「行くな」',
      '容器へ伸びた母さんの手を止めた。母さんは傷ついたように俺を見る。',
      '「あの人、お腹を空かせてるのよ」',
      '俺はドアの前に立った。ここを通さないことだけを考えた。',
    ], next: 'ending_junction', effects: [{ type: 'setFlag', key: 'mother_stopped_by_force', value: true }],
  },
  {
    id: 'mother_let_go', text: [
      '母さんは容器を袋に入れ、隣のドアへ向かった。',
      '止めるべきだと分かっていた。それでも、母さんが何をするのか見届けたい気持ちの方が勝った。',
      'ドアが閉まった。廊下はすぐに静かになった。',
    ], next: 'ending_junction', effects: [{ type: 'setFlag', key: 'mother_left_alone', value: true }],
  },
  {
    id: 'mother_tell_death', text: [
      '「その人は死んでる。四日前に」',
      '母さんの手が止まった。だが、悲しむ顔にはならなかった。',
      '「何言ってるの。昨日も会ったでしょう」',
      '「記録も確認した」',
      '「生きてる人を死んだことにしないで」',
      '声が強くなった。俺も同じ強さで事実を返した。言葉が同じ場所を回り始めた。',
    ], next: 'ending_junction', effects: [{ type: 'setFlag', key: 'mother_confronted_with_death', value: true }],
  },
  {
    id: 'mother_go_together', text: [
      '「俺も行く」',
      '母さんは目を丸くした。それから、少しだけ嬉しそうに笑った。',
      '「そう。じゃあ、一緒に行こうか」',
      '二人で隣室へ入った。人の姿はない。閉じたカーテン、擦り減った椅子、何度も補修された眼鏡ケース。',
      '「おじいちゃん、来たよ。今日は息子も一緒なの」',
      '母さんは空の椅子の方を見て話した。俺には、母さんの声しか聞こえない。',
    ], choices: [
      { label: '母さんは、おじいさんを助けたかったんだよな', next: 'mother_empathy', condition: { type: 'all', conditions: [knowledge('neighbor_long_widowhood'), { type: 'collectionCount', collection: 'selfMemory', atLeast: 3 }] } },
      { label: 'ここには誰もいない', next: 'mother_empty_room' },
    ], effects: [{ type: 'setFlag', key: 'mother_accompanied', value: true }],
  },
  {
    id: 'mother_empty_room', text: [
      '「ここには誰もいない」',
      '母さんは空の椅子と俺を交互に見た。「そこにいるでしょう」',
      '死亡記録と空の部屋を重ねても、母さんの視線は動かなかった。',
    ], next: 'ending_junction', effects: [{ type: 'setFlag', key: 'mother_factually_confronted', value: true }],
  },
  {
    id: 'mother_empathy', text: [
      '「母さんは、おじいさんを助けたかったんだよな」',
      '母さんは答えなかった。容器を持つ指が、蓋の端をなぞった。',
      '「親父が死んだときも、そうだった？」',
      '母さんの唇が動いた。声になるまで時間がかかった。',
      '「あんたたち、まだ小さかったから」',
      '俺は父を失った。母さんは夫を失い、その日から二人の子供を一人で育てた。',
      '妻を失った老人は、家族を助けようとして一線を越えたのかもしれない。その結果、写真と年賀状が途切れた。今、母さんは同じ線の手前にいる。',
      '助けたかったということと、誰かを傷つけたことは別だ。善意は、腕の傷を消さない。',
      '「でも、今日もいたよ」',
      '「今日は俺と帰ろう」',
      '「……ご飯、どうしよう」',
      '「置いていけばいいよ」',
      '母さんは容器を机へ置いた。誰に渡すとも言わず、俺と一緒に部屋を出た。',
    ], next: 'ending_junction', effects: [
      { type: 'setFlag', key: 'mother_empathy_spoken', value: true },
      { type: 'addSelfMemory', key: 'mother_lost_husband' },
      { type: 'addKnowledge', key: 'mother_helping_intent' },
      { type: 'addKnowledge', key: 'neighbor_mother_mirror_understood' },
      { type: 'adjustHidden', key: 'UNDERSTANDING', amount: 2 },
    ],
  },
  {
    id: 'ending_junction', text: ['夜になった。今日集めた事実と、それを読んだ人間の数だけ、この先の形があった。'],
    routes: [
      { condition: trueRequirements, next: 'true_end' },
      { condition: normalRequirements, next: 'normal_end' },
    ], next: 'bad_end',
  },
  {
    id: 'bad_end', title: 'アカノユメをみた。', location: 'old_room', audio: { bgm: 'end-bad', ambience: null, fadeMs: 1800 }, text: [
      '「こいつらはおかしい。話なんか通じない」',
      '母さんの傷害。死亡した老人。それでも会ったという言葉。義弟の赤い夢。全部が一つの原因から広がった。そうしか見えなくなった。',
      '家族を昔の自分の部屋から追い出した。画面に残る古い文を何度も読み返した。',
      '眠れない頭で読むと、かすれた文字が別の意味に見えた。痛みを外へ出す。赤い夢から戻る。',
      '腕の傷へ刃を当てた。痛みの瞬間だけ、頭の中が静かになった。効いていると思った。',
      '次はもう少し深くした。',
      '朝、机へ伏せた俺の手は冷たくなっていた。',
      'アカノユメをみた。',
    ], terminal: true,
  },
  {
    id: 'normal_end', title: '帰宅', audio: { bgm: 'end-normal', ambience: null, fadeMs: 1800 }, variants: [
      { condition: knowledge('words_helped_brother'), text: [
        '俺は母さんへ古いPCを見せた。「アカノユメを作ったわけじゃない。でも、元になった言葉を書いたのは俺だ」',
        '父さんを失った後、俺がどうして地域の風習を書いたのか。今日確かめられた範囲だけを話した。',
        '元の意味へ戻せば全部解決する。そう思いたかった。だが、義弟が読んだのは俺の意図ではなかった。',
        '母さんはすぐには信じなかった。それでも腕へ触れようとはしなくなった。妹と一緒に医療と生活支援へ繋げた。',
        '数年後、義弟の部屋で赤い布と赤い糸が見つかった。コピーされた文章には、彼の言葉が書き足されていた。',
        'その部屋の主がどこへ行ったのか、紙は教えてくれなかった。',
      ] },
      { condition: knowledge('mother_faith_internalization_path'), text: [
        '俺は母さんへ古いPCを見せた。「アカノユメを作ったわけじゃない。でも、元になった言葉を書いたのは俺だ」',
        '母さんは老人から命令されたわけではない。理解しようとして紙を読み、自分に必要な意味を拾った。だから元を示せば戻せる。俺はそう考えた。',
        '母さんはすぐには信じなかった。それでも腕へ触れようとはしなくなった。妹と一緒に医療と生活支援へ繋げた。',
        '数年後、義弟の部屋で赤い布と赤い糸が見つかった。コピーされた文章には、彼の言葉が書き足されていた。',
        'その部屋の主がどこへ行ったのか、紙は教えてくれなかった。',
      ] },
      { condition: { type: 'all', conditions: [knowledge('neighbor_long_widowhood'), knowledge('neighbor_relative_injury_confirmed')] }, text: [
        '俺は母さんへ古いPCを見せた。「アカノユメを作ったわけじゃない。でも、元になった言葉を書いたのは俺だ」',
        '老人が人を傷つけた事実は消えない。それでも、最初から誰かを傷つけるために、あの紙を持っていたとも思えなかった。',
        '母さんはすぐには信じなかった。それでも腕へ触れようとはしなくなった。妹と一緒に医療と生活支援へ繋げた。',
        '数年後、義弟の部屋で赤い布と赤い糸が見つかった。コピーされた文章には、彼の言葉が書き足されていた。',
        'その部屋の主がどこへ行ったのか、紙は教えてくれなかった。',
      ] },
      { condition: knowledge('neighbor_long_widowhood'), text: [
        '俺は母さんへ古いPCを見せた。「アカノユメを作ったわけじゃない。でも、似た言葉を書いたのは俺だ」',
        '妻を亡くした老人が、あの紙を長く手放せなかった理由を俺は知らない。最初から誰かを傷つけるためだった、と決める材料もなかった。',
        '母さんはすぐには信じなかった。それでも腕へ触れようとはしなくなった。妹と一緒に医療と生活支援へ繋げた。',
        '数年後、義弟の部屋で赤い布と赤い糸が見つかった。コピーされた文章には、彼の言葉が書き足されていた。',
        'その部屋の主がどこへ行ったのか、紙は教えてくれなかった。',
      ] },
    ], text: [
      '俺は母さんへ古いPCを見せた。「アカノユメを作ったわけじゃない。でも、元になった言葉を書いたのは俺だ」',
      '父さんを失った後、俺がどうして地域の風習を書いたのか。今日確かめられた範囲だけを話した。',
      '母さんはすぐには信じなかった。それでも腕へ触れようとはしなくなった。妹と一緒に医療と生活支援へ繋げた。',
      '数年後、義弟の部屋で赤い布と赤い糸が見つかった。コピーされた文章には、彼の言葉が書き足されていた。',
      'その部屋の主がどこへ行ったのか、紙は教えてくれなかった。',
    ], terminal: true,
  },
  {
    id: 'true_end', title: 'それでも、信じる', audio: { bgm: 'end-true', ambience: null, fadeMs: 1800 }, variants: [{ condition: knowledge('neighbor_relative_injury_confirmed'), text: [
      '母さんはすぐに変わらなかった。翌朝も「おじいちゃんの薬」と言いかけ、途中で止まった。',
      '俺たちは医療と生活支援へ繋がった。母さんの見た老人を、いないと言い続けることも、いると認めることもしなかった。',
      '義弟には「あれで楽になったなら、そこまで嘘だったことにはしない」と伝えた。',
      '「でも、人を傷つけるところまで正しいとは言えない」',
      '老人が家族を助けようとした可能性は、孫世代の親族を傷つけた事実を軽くしない。母さんの善意も、俺の腕を許容する理由にはならない。',
      '言葉が誰かを救ったことと、その言葉で誰かが傷ついたことは、両方とも残った。',
    ] }], text: [
      '母さんはすぐに変わらなかった。翌朝も「おじいちゃんの薬」と言いかけ、途中で止まった。',
      '俺たちは医療と生活支援へ繋がった。母さんの見た老人を、いないと言い続けることも、いると認めることもしなかった。',
      '義弟には「あれで楽になったなら、そこまで嘘だったことにはしない」と伝えた。',
      '「でも、人を傷つけるところまで正しいとは言えない」',
      '老人の過去を、都合よく善意だけで埋めることもしなかった。母さんの善意も、俺の腕を許容する理由にはならない。',
      '言葉が誰かを救ったことと、その言葉で誰かが傷ついたことは、両方とも残った。',
    ], choices: [
      { label: '数日後、ミナへ連絡する', next: 'secret_end', condition: secretRequirements },
      { label: 'この結末を閉じる', next: 'true_end_close' },
    ], effects: [{ type: 'setFlag', key: 'true_cleared', value: true }],
  },
  {
    id: 'true_end_close', title: 'それでも、信じる', text: [
      '信じることと、傷つけることを同じにしない。俺にできるのは、その境界を何度でも引き直すことだった。',
    ], terminal: true,
  },
  {
    id: 'secret_end', title: 'アカノユメ', audio: { bgm: 'end-secret', ambience: null, fadeMs: 1800 }, text: [
      '数日後、ミナと通話しながら、ネットに残る断片を見た。',
      '「俺が消して回ったって意味ないか」',
      '『無理でしょ』',
      '少し間があった。',
      '『じゃあ、また変えれば？』',
      '俺たちは、古いページと同じように小さな文章を置いた。傷は赤いペンの印に。血を分けるは赤い物の交換に。痛みを分けるは、誰かに話すことに。',
      '年月が過ぎた。アカノユメは「赤い紙に願いを書いて誰かへ渡す」小さなおまじないになっていた。俺たちが書いた通りではない。それで良かった。',
      '駅のカフェで、一人の女性が立ち上がった。',
      '「……ミナ？」',
      '「久しぶり」',
      '「いや、初めましてだろ」',
      '彼女は笑った。',
    ], terminal: true,
  },
]

