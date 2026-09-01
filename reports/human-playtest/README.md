# HUMAN PLAYTEST

1. `npm run dev`で起動し、`/?playtest=1`へアクセスする。
2. 通常どおりプレイする。節目の質問は任意回答で、ゲーム内時間を消費しない。
3. END後にアンケートを保存し、`EXPORT TEST LOG`からJSONを取得する。
4. JSONを`reports/human-playtest/sessions/`へ置く。
5. `npm run report:human`で`human-playtest-report.md`を生成する。

自動分類A/B/Cは補助判定である。自由回答原文を人間が読み、複数セッションで同じ誤読が再現するまでシナリオ条件を変更しない。

