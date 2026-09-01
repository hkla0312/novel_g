import type { Condition, ScenarioNode } from '../types/scenario'

const flag = (key: string): Condition => ({ type: 'flag', key })
const knowledge = (key: string): Condition => ({ type: 'knowledge', key })
const notFlag = (key: string): Condition => ({ type: 'not', condition: flag(key) })

const trueRequirements: Condition = { type: 'all', conditions: [
  flag('author_revealed'), knowledge('library_jigaeshi_confirmed'), knowledge('neighbor_long_widowhood'),
  flag('brother_understood'), flag('mother_accompanied'), flag('mother_empathy_spoken'),
  { type: 'collectionCount', collection: 'selfMemory', atLeast: 4 },
  { type: 'hidden', key: 'UNDERSTANDING', atLeast: 4 },
] }

const normalRequirements: Condition = { type: 'all', conditions: [
  flag('author_revealed'), { type: 'collectionCount', collection: 'selfMemory', atLeast: 3 },
] }

const secretRequirements: Condition = { type: 'all', conditions: [
  flag('true_cleared'), flag('mina_contacted'), flag('mina_deepened'), flag('original_pages_recovered'),
  knowledge('library_jigaeshi_confirmed'), knowledge('neighbor_long_widowhood'), flag('brother_understood'),
] }

export const act3to5Nodes: ScenarioNode[] = [
  {
    id: 'act3_opening', title: 'ACT 3　アカノユメとは何か', location: 'home', text: [
      '仕事を休むと伝えた。電話を切ると、部屋の静けさが戻った。',
      '古い風習と、老人が残した紙。似た言葉はある。それでも、同じものとするには差が大きすぎる。',
      '俺の昔のPCに、その差を埋めるものがあるかもしれない。',
    ], next: 'act3_hub',
  },
  {
    id: 'act3_hub', title: '残った資料', location: 'home', text: [
      '黄ばんだ紙の写真と、図書館で書き写した記録を並べる。比べるか、PCへ進むか。',
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
      '一度の詤曲ではないのかもしれない。誰かが少し言い換え、次の誰かがまた読み足した。その方が、紙の古さには合っている。',
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
    ], next: 'pc_index',
  },
  {
    id: 'pc_index', title: 'index.html', text: [
      'ブラウザに、灰色の背景と青いリンクが出た。「この町の古い話」。',
      '下手な文章だった。一文が長く、同じ言葉を何度も使っている。それでも、書き方に覚えがあった。',
      'ページ末の名前はハンドルネームだった。今はまだ、自分の名前のようには見えない。',
    ], next: 'pc_about', effects: [{ type: 'addSelfMemory', key: 'old_web_creation' }],
  },
  {
    id: 'pc_about', title: 'about.html', text: [
      '「俺は神様とかおまじないは信じてない」と書いてある。笑えない。父さんの死に意味を付ける大人へ、俺が心の中で繰り返した文句だった。',
      'その後に「こういう話を知ったら、少し楽になる人もいるかもしれない」と続く。',
      '信じたくない。でも、誰かを助けたい。子供の俺は、その矛盾ごとページにした。',
    ], next: 'pc_town', effects: [{ type: 'adjustHidden', key: 'SELF', amount: 1 }],
  },
  {
    id: 'pc_town', title: 'town.html', text: [
      '地還しの写真が、低い解像度で貼られていた。図書館の資料から引いた文もある。',
      '「家の難儀は家で分ける。一人に全部を持たせない」',
      '血も刃物もない。赤い紙に困っていることを書き、家族で話す。そういう「新しいやり方」を、俺は勝手に足していた。',
    ], next: 'pc_aka', effects: [{ type: 'addKnowledge', key: 'original_harmless_ritual' }],
  },
  {
    id: 'pc_aka', title: 'aka.html', text: [
      '見出しは「アカノユメ」。',
      '老人の紙と同じ文の骨組みがある。ただし、ここでは「家の痛みは、家の人で分ける」だった。',
      'ページのソースに、ミナの書いたコメントが残っている。「リンク先、ここじゃないよ」。',
      '心臓が一度、強く打った。キーボードへ置いた手のひらが湿っている。',
      'ファイルの作成者名。更新履歴。余白に残った俺の本名。どれも同じ場所を指していた。',
    ], next: 'author_reveal',
  },
  {
    id: 'author_reveal', title: '原点', text: [
      '黄ばんだ紙は、このページをコピーした先で何度も書き換えられたものだ。',
      '最初の文章を書いた人間は、今この画面を見ている。',
      '「……俺だ。」',
    ], next: 'brother_call', effects: [
      { type: 'setFlag', key: 'author_revealed', value: true },
      { type: 'setFlag', key: 'original_pages_recovered', value: true },
      { type: 'addKnowledge', key: 'original_site_author' },
      { type: 'adjustHidden', key: 'FACT', amount: 2 },
      { type: 'adjustHidden', key: 'SELF', amount: 2 },
    ],
  },
  {
    id: 'brother_call', title: '義弟', text: [
      '妹の夫へ電話した。そこで初めて、彼がアカノユメの紙を読んでいたと知った。',
      '「全部が間違ってるわけじゃない」',
      '「俺が書いたんだ。元は、そんな意味じゃなかった」',
      '「お前がどういうつもりで書いたかなんて関係ない。俺があれを読んだとき、お前はそこにいなかった」',
      '声は怒っているというより、追い詰められていた。',
      '「あれで少し楽になった。それも間違いだったって言うのか？」',
    ], choices: [
      { label: '何言ってんだ、お前', next: 'brother_reject' },
      { label: '母さんに何を言われた？', next: 'brother_information' },
      { label: 'どこが間違ってないと思った？', next: 'brother_understand' },
    ],
  },
  {
    id: 'brother_reject', text: [
      '「何言ってんだ、お前。あの文章で母さんは人を傷つけたんだぞ」',
      '「……そうか」',
      '義弟はそれ以上話さなかった。間違ったことを止めるためには、それで十分だと思った。',
    ], next: 'mother_returns_evening', effects: [{ type: 'setFlag', key: 'brother_rejected', value: true }],
  },
  {
    id: 'brother_information', text: [
      '「母さんに何を言われた？」',
      '「別に。紙を見せられて、俺が勝手に読んだ」',
      '仕事を失う不安。妹を支えられないかもしれない恐怖。彼は事実を話したが、どの言葉が彼を支えたのかは言わなかった。',
    ], next: 'mother_returns_evening', effects: [{ type: 'setFlag', key: 'brother_questioned', value: true }, { type: 'adjustHidden', key: 'FACT', amount: 1 }],
  },
  {
    id: 'brother_understand', text: [
      '「どこが間違ってないと思った？」',
      '長い沈黙の後、義弟が息を吐いた。',
      '「……一人で全部抱えなくていいってところ」',
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
    id: 'mother_returns_evening', title: 'ACT 5　母が帰ってくる', location: 'home', text: [
      '玄関の鍵が回った。',
      '「ただいまー」',
      '母さんは買い物袋を両手に下げ、いつもの声で帰ってきた。俺の腕を見て、心配そうに顔を曇らせる。',
      '「腕、大丈夫だった？」',
      '「病院で処置した」',
      '「そう。良かった」',
      'それから母さんは豆腐を冷蔵庫へ入れ、惣菜を皿へ移した。半分だけ別の容器によそう。',
      '「それ、何」',
      '「おじいちゃんの。ちょっと行ってくるね」',
    ], choices: [
      { label: '止める', next: 'mother_stop' },
      { label: '一緒に行く', next: 'mother_go_together' },
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
      '「でも、今日もいたよ」',
      '「今日は俺と帰ろう」',
      '「……ご飯、どうしよう」',
      '「置いていけばいいよ」',
      '母さんは容器を机へ置いた。誰に渡すとも言わず、俺と一緒に部屋を出た。',
    ], next: 'ending_junction', effects: [
      { type: 'setFlag', key: 'mother_empathy_spoken', value: true },
      { type: 'addSelfMemory', key: 'mother_lost_husband' },
      { type: 'addKnowledge', key: 'mother_helping_intent' },
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
    id: 'bad_end', title: 'BAD END　アカノユメをみた。', location: 'neighbor_apartment', text: [
      '「こいつらはおかしい。話なんか通じない」',
      '母さんの手から鍵を取り、隣室へ入った。誰にも邪魔されず紙を読める場所が必要だった。',
      '眠れない頭で読むと、かすれた文字が別の意味に見えた。痛みを外へ出す。赤い夢から戻る。',
      '腕の傷へ刃を当てた。痛みの瞬間だけ、頭の中が静かになった。効いていると思った。',
      '次はもう少し深くした。',
      '朝、黄ばんだ紙の上で、俺の手は冷たくなっていた。',
      'アカノユメをみた。',
    ], terminal: true,
  },
  {
    id: 'normal_end', title: 'NORMAL END　帰宅', text: [
      '俺は母さんへ古いPCを見せた。「これを書いたのは俺だ。元は血を分ける話じゃない」',
      '父さんを失った後、俺がどうして書いたのか。地還しの元の意味も話した。',
      '母さんはすぐには信じなかった。それでも腕へ触れようとはしなくなった。妹と一緒に医療と生活支援へ繋げた。',
      '数年後、義弟の部屋で赤い布と赤い糸が見つかった。コピーされた文章には、彼の言葉が書き足されていた。',
      'その部屋の主がどこへ行ったのか、紙は教えてくれなかった。',
    ], terminal: true,
  },
  {
    id: 'true_end', title: 'TRUE END　それでも、信じる', text: [
      '母さんはすぐに変わらなかった。翌朝も「おじいちゃんの薬」と言いかけ、途中で止まった。',
      '俺たちは医療と生活支援へ繋がった。母さんの見た老人を、いないと言い続けることも、いると認めることもしなかった。',
      '義弟には「あれで楽になったなら、そこまで嘘だったことにはしない」と伝えた。',
      '「でも、人を傷つけるところまで正しいとは言えない」',
      '言葉が誰かを救ったことと、その言葉で誰かが傷ついたことは、両方とも残った。',
      '死後の部屋で母さんが誰と話したのかは、その後も分からない。',
    ], choices: [
      { label: '数日後、ミナへ連絡する', next: 'secret_end', condition: secretRequirements },
      { label: 'この結末を閉じる', next: 'true_end_close' },
    ], effects: [{ type: 'setFlag', key: 'true_cleared', value: true }],
  },
  {
    id: 'true_end_close', title: 'TRUE END　それでも、信じる', text: [
      '信じることと、傷つけることを同じにしない。俺にできるのは、その境界を何度でも引き直すことだった。',
    ], terminal: true,
  },
  {
    id: 'secret_end', title: 'SECRET END　アカノユメ', text: [
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

