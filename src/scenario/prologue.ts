import type { ScenarioNode } from '../types/scenario'

export const prologueNodes: ScenarioNode[] = [
  {
    id: 'prologue', title: 'PROLOGUE', text: [
      '深夜。実家の布団の中で、俺は浅い眠りを行き来していた。',
      '背中に人の体温がある。母さんの腕が、子供を抱くように俺の胸へ回っている。こんなふうに眠った記憶は、もう何十年もない。',
      '振りほどこうとしたはずなのに、身体が動かない。耳元で母さんが何か言った。言葉ではなく、息の形だけが残った。',
    ], next: 'red_dream',
  },
  {
    id: 'red_dream', text: [
      '赤い夢を見た。',
      '赤い地面に、家の影が落ちていた。誰かが土を手ですくい、俺の掌へ戻そうとしている。受け取ってはいけない気がした。',
      'それでも夢の中の俺は、手を閉じた。',
    ], next: 'wake_injury',
  },
  {
    id: 'wake_injury', title: '07:31　実家', location: 'home', timeCost: 1, text: [
      '腕の痛みで目が覚めた。熱い。寝痺れとは違う、皮膚を直接こすられるような痛みだ。',
      '「……嘘だろ」',
      '左腕に細い傷が何本も走っている。そのうち数本には、折った剃刀の刃が浅く引っかかっていた。理解するより先に息が詰まり、布団を蹴った。',
      '刃を摘まむ指が震えた。一本。二本。血が遅れて膨らみ、腕を伝った。頭の中が真っ白になった。誰が、ではない。まず、止めないと。',
    ], next: 'first_aid', effects: [{ type: 'setFlag', key: 'injured', value: true }],
  },
  {
    id: 'first_aid', location: 'home', timeCost: 7, text: [
      '洗面所へ駆け込み、水を流す。赤が薄まって排水口へ消えるのを見ても、心臓は速いままだった。',
      '救急箱を引きずり出し、震える手でガーゼを押し当てた。深い傷はなさそうだ。それが分かって、ようやく膝から力が抜けた。',
      '呼吸を数えた。四つ吸って、長く吐く。痛い。怖い。だが、出血は止められる。救急車を呼ぶほどではない。病院には行くべきだ。',
      'そこで初めて、考えが次の形を取った。――誰がやった？',
    ], next: 'sister_first',
  },
  {
    id: 'sister_first', location: 'home', text: [
      '廊下へ出ると、妹が台所の前に立っていた。俺の腕を見て、視線を逸らした。驚いた人間の反応ではない。見つかることを待っていた人間の仕草だった。',
      '「知ってるのか」',
      '妹は唇を噛んだ。それから、母さんの部屋を見た。答えは聞く前に分かった。分かりたくはなかった。',
      '「母さんに、聞いた方がいい。私も一緒に行く」',
    ], next: 'mother_confront',
  },
  {
    id: 'mother_confront', location: 'home', timeCost: 5, text: [
      '母さんは制服のブラウスにアイロンをかけていた。俺の腕を見ると、少し困ったように眉を寄せた。',
      '「これ、母さんがやったのか」',
      '「うん。でも浅くしたよ。必要だったから」',
      '否定も言い訳もなかった。声は、薬を飲んだか確認するときと同じだった。',
      '「ちゃんと分けただけ。一人で持っていたら駄目でしょう。家のものなんだから」',
      '何を、と聞き返した声が裏返った。母さんは俺の肩を強く掴んだ。爪が食い込み、昨夜の体温が急に蘇る。',
      '「また持っていかれるでしょう」',
      '目の前の母さんは怯えていた。俺を傷つけた人間の顔ではなく、俺を何かから守ろうとしている人間の顔だった。それが、余計に怖かった。',
    ], next: 'mother_returns_normal', effects: [{ type: 'setFlag', key: 'mother_admitted_injury', value: true }, { type: 'adjustHidden', key: 'FACT', amount: 1 }],
  },
  {
    id: 'mother_returns_normal', location: 'home', text: [
      '「分かった。……ごめん」',
      'それ以外の言葉が出なかった。母さんの指から力が抜けた。',
      '「いいのよ。分かれば」',
      '母さんは時計を見て、アイロンの電源を抜いた。「もうこんな時間。晩御飯、何がいい？　遅くなるなら連絡してね」',
      '返事を待たず、いつもの鞄を持って玄関を出た。扉が閉じるまで、何も異常ではない朝のようだった。',
    ], next: 'sister_questions',
  },
  {
    id: 'sister_questions', title: '妹に聞く', location: 'home', text: [
      '妹と向かい合って座った。聞きたいことは多い。全部を聞く必要があるのかは分からない。腕の痛みが、考えるたびに割り込んでくる。',
    ], choices: [
      { label: '母さんがおかしくなったのはいつから？', next: 'q_when', timeCost: 3, condition: { type: 'not', condition: { type: 'flag', key: 'asked_when' } }, effects: [{ type: 'setFlag', key: 'asked_when', value: true }] },
      { label: '昨夜、何があった？', next: 'q_last_night', timeCost: 3, condition: { type: 'not', condition: { type: 'flag', key: 'asked_last_night' } }, effects: [{ type: 'setFlag', key: 'asked_last_night', value: true }] },
      { label: '隣のおじいさんって誰？', next: 'q_neighbor', timeCost: 3, condition: { type: 'not', condition: { type: 'flag', key: 'asked_neighbor' } }, effects: [{ type: 'setFlag', key: 'asked_neighbor', value: true }, { type: 'addKnowledge', key: 'neighbor_profile' }] },
      { label: 'お前は何かされてないのか？', next: 'q_sister_harmed', timeCost: 3, condition: { type: 'not', condition: { type: 'flag', key: 'asked_sister' } }, effects: [{ type: 'setFlag', key: 'asked_sister', value: true }] },
      { label: '旦那はこのことを知ってるのか？', next: 'q_husband', timeCost: 3, condition: { type: 'not', condition: { type: 'flag', key: 'asked_husband' } }, effects: [{ type: 'setFlag', key: 'asked_husband', value: true }] },
      { label: 'もういい', next: 'free_action_hub' },
    ],
  },
  {
    id: 'q_when', location: 'home', text: [
      '「はっきり、いつからっていうのは分からない。普通のときの方が多かったから」',
      '妹は、父さんの法事の頃には妙な言い回しが増えていた、と話した。ただ、それだけで人が突然別人になるわけではない。俺たちは小さな違和感を、疲れや寂しさの中へ片づけてきたらしい。',
    ], next: 'sister_questions',
  },
  {
    id: 'q_last_night', location: 'home', text: [
      '「母さん、夜中にあんたの部屋へ行った。様子を見に行くって。少しして見たら、抱きついて寝てた。変だとは思ったけど……刃物なんて見えなかった」',
      '止めなかった妹を責める言葉が浮かび、飲み込んだ。あの場面だけなら、久しぶりに帰った息子へ過剰に触れただけにも見えたはずだ。結果を知った俺が、過去の妹に正解を要求するのは卑怯だ。',
    ], next: 'sister_questions',
  },
  {
    id: 'q_neighbor', location: 'home', text: [
      '隣の部屋には、俺が実家を出た後に高齢の男が越してきたらしい。妻をずっと前に亡くした独居老人。以前のアパートは強制退去になったと聞いたが、理由までは知らない。',
      '「前は暗くて、ちょっと怖かった。でも何かされたわけじゃない。最近は外に出られなくて、母さんがご飯とか薬とか手伝ってた」',
      '強制退去。鬱屈した態度。母さんとの接触。疑う材料に見える。だが、暗い人間だから危険だと決めるのは、材料ではなく俺の都合だ。',
    ], next: 'sister_questions',
  },
  {
    id: 'q_sister_harmed', location: 'home', text: [
      '妹は袖口をいじった。「腕を強く掴まれたことはある。軽く噛まれたり、ずっと抱かれたり。毎回じゃないし、次の日は普通だった」',
      '今回は明らかに違う、と妹は言った。心配させたくなかった、という説明を、俺は否定できなかった。普通の日が多いほど、異常な一日を異常だと認めるのは難しい。',
    ], next: 'sister_questions', effects: [{ type: 'addKnowledge', key: 'sister_previous_incidents' }],
  },
  {
    id: 'q_husband', location: 'home', text: [
      '「知ってる。私が隣のおじいさんの部屋に入りたくなくて、何度か介護について行ってくれた」',
      '別の地域で育った義弟には、母さんの言葉がどう聞こえたのだろう。妹は、夫が何かを隠しているとは言わなかった。ただ、心配はしていたらしい。',
    ], next: 'sister_questions', effects: [{ type: 'addKnowledge', key: 'husband_knows' }],
  },
]

