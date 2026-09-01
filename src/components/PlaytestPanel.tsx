import { useMemo, useState } from 'react'
import { isPlaytestMode, playtestLogger } from '../playtest/playtestLogger'
import type { GameSnapshot } from '../types/game'
import { Modal } from './Modal'

const checkpoints: Record<string, { point: string; question: string }> = {
  wake_injury: { point: 'prologue', question: '今の時点で何が起きていると思いますか？' },
  brother_initial_call: { point: 'brother-dream', question: '赤い夢の原因は何だと思いますか？' },
  danchi_death_reveal: { point: 'death-reveal', question: '母親についてどう考えていますか？' },
  neighbor_old_paper: { point: 'butsuma-a4', question: '老人は何をしていた人物だと思いますか？' },
  author_reveal: { point: 'old-pc', question: '主人公とアカノユメの関係をどう考えますか？' },
  mother_returns_evening: { point: 'act5', question: '現在、何が起きていると考えていますか？' },
  mother_stop: { point: 'act5-choice', question: 'なぜACT5でこの選択肢を選びましたか？' },
  mother_go_together: { point: 'act5-choice', question: 'なぜACT5でこの選択肢を選びましたか？' },
  mother_let_go: { point: 'act5-choice', question: 'なぜACT5でこの選択肢を選びましたか？' },
  mother_tell_death: { point: 'act5-choice', question: 'なぜACT5でこの選択肢を選びましたか？' },
  mother_empty_room: { point: 'act5-second-choice', question: '老人宅で、なぜこの言葉を選びましたか？' },
  mother_empathy: { point: 'act5-second-choice', question: '老人宅で、なぜこの言葉を選びましたか？' },
}
const surveyQuestions = [
  'この物語で何が起きたと思いますか？','アカノユメとは何だったと思いますか？','老人はどんな人物だったと思いますか？','母親はなぜ主人公を傷つけたと思いますか？','義弟はなぜアカノユメへ惹かれたと思いますか？','主人公の赤い夢の原因は何だと思いますか？','義弟の赤い夢の原因は何だと思いますか？','老人が死んだ後、母親は誰と話していたと思いますか？','途中で一番疑った人物は誰ですか？','推理が大きく変わった場面はありますか？','説明不足だった部分は？','説明しすぎだと思った部分は？','一番怖かった場面は？','一番印象に残った場面は？','別のENDINGを見たいと思いますか？',
]
const ratings = ['STORY UNDERSTANDING','MYSTERY','HORROR','CHARACTER BELIEVABILITY','PACING','DESIRE TO REPLAY']

export function PlaytestPanel({ game }: { game: GameSnapshot }) {
  const checkpoint = checkpoints[game.currentNode]
  const [dismissed, setDismissed] = useState<string[]>([])
  const [answer, setAnswer] = useState('')
  const [confidence, setConfidence] = useState(50)
  const [survey, setSurvey] = useState<Record<string, string | number>>({})
  const ending = ['bad_end','normal_end','true_end','secret_end'].includes(game.currentNode)
  const showQuestion = isPlaytestMode() && checkpoint && !dismissed.includes(checkpoint.point) && !playtestLogger.hasAnswer(checkpoint.point)
  const unansweredSurvey = useMemo(() => ending && surveyQuestions.some((_, i) => !survey[`q${i + 1}`]), [ending, survey])
  if (!isPlaytestMode()) return null
  const submitQuestion = () => { if (!checkpoint || !answer.trim()) return; playtestLogger.answer({ point: checkpoint.point, question: checkpoint.question, answer: answer.trim(), confidence }); setDismissed([...dismissed, checkpoint.point]); setAnswer('') }
  return <>
    <div className="playtest-badge">HUMAN PLAYTEST MODE</div>
    {showQuestion && <Modal title="PLAYTEST NOTE" onClose={() => setDismissed([...dismissed, checkpoint.point])}>
      <p className="playtest-question">{checkpoint.question}</p><textarea maxLength={300} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="100〜300文字程度（任意）" />
      <label className="playtest-confidence">CONFIDENCE {confidence}<input type="range" min="0" max="100" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} /></label>
      <button className="playtest-submit" onClick={submitQuestion}>記録して続ける</button>
    </Modal>}
    {ending && <div className="playtest-export">
      {unansweredSurvey && <details><summary>ENDING後アンケート</summary><div className="survey-list">
        {surveyQuestions.map((q, i) => <label key={q}>{i + 1}. {q}<textarea value={String(survey[`q${i + 1}`] ?? '')} onChange={(e) => setSurvey({ ...survey, [`q${i + 1}`]: e.target.value })} /></label>)}
        {ratings.map((r) => <label key={r}>{r}: {survey[r] ?? 50}<input type="range" min="0" max="100" value={Number(survey[r] ?? 50)} onChange={(e) => setSurvey({ ...survey, [r]: Number(e.target.value) })} /></label>)}
        <button onClick={() => playtestLogger.survey(survey, game)}>アンケートを保存</button>
      </div></details>}
      <button onClick={() => playtestLogger.export()}>EXPORT TEST LOG</button>
    </div>}
  </>
}

