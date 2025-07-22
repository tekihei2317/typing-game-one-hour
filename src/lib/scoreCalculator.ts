import type { PracticeResult, WordResult, WordTypingInfo } from "../types";

/**
 * タイピング練習の結果を計算する純粋関数
 */
export function calculateResults(
  wordTypingInfos: WordTypingInfo[],
): PracticeResult {
  const completedWords = wordTypingInfos.filter(
    (info) => info.completionTime !== null && info.startTime !== null,
  );

  if (completedWords.length === 0) {
    throw new Error("完了したワードがありません");
  }

  const firstWordStartTime = completedWords[0].startTime;
  const lastWordCompletionTime = Math.max(
    ...completedWords.map((info) => info.completionTime!),
  );
  const totalTime = (lastWordCompletionTime - firstWordStartTime) / 1000; // 秒

  // 総入力文字数とミス数
  const totalInputCharacterCount = completedWords.reduce(
    (sum, info) => sum + info.inputKeys.length,
    0,
  );
  const totalMissCount = completedWords.reduce(
    (sum, info) => sum + info.missCount,
    0,
  );

  // 正確率の計算
  const accuracy =
    totalMissCount === 0
      ? 100
      : (totalInputCharacterCount /
          (totalInputCharacterCount + totalMissCount)) *
        100;

  // 全体のKPM
  const overallKpm = Math.round((totalInputCharacterCount / totalTime) * 60);

  // 初速の計算（各ワードの初速の平均）
  const initialSpeeds = completedWords
    .filter((info) => info.firstInputTime !== null)
    .map((info) => (info.firstInputTime! - info.startTime) / 1000);

  const averageInitialSpeed =
    initialSpeeds.length > 0
      ? initialSpeeds.reduce((sum, speed) => sum + speed, 0) /
        initialSpeeds.length
      : 1.0;

  // ワード別結果の計算
  const wordResults: WordResult[] = completedWords.map((info) => {
    const wordTime = (info.completionTime! - info.startTime) / 1000;
    const initialSpeed = info.firstInputTime
      ? (info.firstInputTime - info.startTime) / 1000
      : 1.0;

    // KPM: (入力文字数 / 時間) * 60
    const kpm = Math.round((info.inputKeys.length / wordTime) * 60);

    // RKPM: 初速を除いた計算
    let rkpm = 0;
    if (info.firstInputTime && info.inputKeys.length > 1) {
      const rkpmTime = (info.completionTime! - info.firstInputTime) / 1000;
      if (rkpmTime > 0) {
        rkpm = Math.round(((info.inputKeys.length - 1) / rkpmTime) * 60);
      }
    }

    return {
      word: info.word,
      initialSpeed,
      kpm,
      rkpm,
      missCount: info.missCount,
    };
  });

  // 全体のRKMP（全ワードの合計から計算）
  const totalKeysAfterFirstInput = completedWords.reduce((sum, info) => {
    return sum + Math.max(0, info.inputKeys.length - 1);
  }, 0);

  const totalTimeAfterFirstInput = completedWords.reduce((sum, info) => {
    if (info.firstInputTime) {
      return sum + (info.completionTime! - info.firstInputTime) / 1000;
    }
    return sum;
  }, 0);

  const overallRkpm =
    totalTimeAfterFirstInput > 0
      ? Math.round((totalKeysAfterFirstInput / totalTimeAfterFirstInput) * 60)
      : 0;

  // スコア計算（正確率 × KPM / 100）
  const score = Math.round(accuracy * (overallKpm / 100));

  return {
    score,
    inputTime: totalTime,
    inputCharacterCount: totalInputCharacterCount,
    missCount: totalMissCount,
    accuracy: Math.round(accuracy * 100) / 100, // 小数点以下2桁
    kpm: overallKpm,
    rkpm: overallRkpm,
    initialSpeed: Math.round(averageInitialSpeed * 1000) / 1000, // 小数点以下3桁
    wordResults,
  };
}
