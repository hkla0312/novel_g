/* global process */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const input = process.argv[2] ?? 'reports/human-playtest/sessions'
const output = process.argv[3] ?? 'reports/human-playtest/human-playtest-report.md'
await mkdir(input, { recursive: true })
const files = (await readdir(input)).filter((name) => name.endsWith('.json'))
const sessions = await Promise.all(files.map(async (name) => JSON.parse(await readFile(path.join(input, name), 'utf8'))))
const count = (test) => sessions.filter(test).length
const hasMilestone = (session, name) => session.events?.some((event) => event.type === 'milestone' && event.data?.name === name)
const ending = (session) => session.events?.findLast((event) => event.type === 'ending')?.data?.ending ?? 'INCOMPLETE'
const distribution = Object.fromEntries(['bad_end','normal_end','true_end','secret_end','INCOMPLETE'].map((id) => [id, count((s) => ending(s) === id)]))
const trueFacts = (s) => ['wifeLoss','jigaeshi','oldPc','brotherRevisit','motherAccompanied','motherEmpathy'].filter((key) => hasMilestone(s, key))
const classify = (s) => {
  if (ending(s) === 'true_end' || ending(s) === 'secret_end') return 'TRUE/SECRET'
  if (trueFacts(s).length < 6) return 'A 情報不足'
  const text = [...(s.answers ?? []).map((a) => a.answer), ...Object.values(s.endingSurvey ?? {}).filter((v) => typeof v === 'string')].join(' ')
  const understands = /(共感|重ね|夫.*失|喪失|一人で.*抱)/.test(text)
  return understands ? 'C 理解と選択の不一致候補' : 'B 理解不足候補'
}
const classifications = Object.fromEntries(['A 情報不足','B 理解不足候補','C 理解と選択の不一致候補','TRUE/SECRET'].map((key) => [key, count((s) => classify(s) === key)]))
const rate = (name) => sessions.length ? `${Math.round(count((s) => hasMilestone(s, name)) / sessions.length * 1000) / 10}%` : '0%'
const answers = sessions.flatMap((s) => (s.answers ?? []).map((a) => `- ${s.sessionId} / ${a.point}: ${a.answer}`)).join('\n') || '- なし'
const markdown = `# HUMAN PLAYTEST REPORT\n\n- sessions: ${sessions.length}\n\n## ENDING\n\n${Object.entries(distribution).map(([k,v]) => `- ${k}: ${v}`).join('\n')}\n\n## 到達率\n\n- Mina: ${rate('minaContacted')}\n- 老人宅: ${rate('neighborHome')}\n- 仏間: ${rate('butsuma')}\n- 地還し: ${rate('jigaeshi')}\n- 老人受信者理解材料: ${rate('wifeLoss')}\n- 母内面化・共感選択: ${rate('motherEmpathy')}\n\n## TRUE未到達分類（自動補助）\n\n${Object.entries(classifications).map(([k,v]) => `- ${k}: ${v}`).join('\n')}\n\n自由回答の意味分類は補助判定であり、必ず人間が原文を確認する。\n\n## 自由回答\n\n${answers}\n`
await mkdir(path.dirname(output), { recursive: true }); await writeFile(output, markdown, 'utf8'); process.stdout.write(markdown)

