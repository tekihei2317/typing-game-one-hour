import type { PracticeResult, WordResult } from "../types";
import type { WordTypingEvent } from "./typing-event";

/**
 * ワード別のタイピング結果を計算する
 */
function calculateWordResult(event: WordTypingEvent): WordResult {
  const correctEvents = event.keyTypeEvents.filter((e) => e.result.isCorrect);
  const missCount = event.keyTypeEvents.filter(
    (e) => !e.result.isCorrect
  ).length;

  if (correctEvents.length === 0) {
    return {
      word: event.word,
      initialSpeed: 0,
      inputTime: 0,
      inputCharacterCount: 0,
      kpm: 0,
      rkpm: 0,
      missCount
    };
  }

  // 初速計算: 表示から最初の正解までの時間（秒）
  const firstCorrectEvent = correctEvents[0];
  const initialSpeed =
    (firstCorrectEvent.timestamp.getTime() - event.displayedAt.getTime()) /
    1000;

  // 入力時間計算: 表示から最後の正解までの時間（秒）
  const lastCorrectEvent = correctEvents[correctEvents.length - 1];
  const totalTime =
    (lastCorrectEvent.timestamp.getTime() - event.displayedAt.getTime()) / 1000;

  // KPM計算: 正解文字数 / 総時間 * 60
  const kpm =
    totalTime > 0 ? Math.round((correctEvents.length / totalTime) * 60) : 0;

  // RKPM計算: (正解文字数 - 1) / (総時間 - 初速) * 60
  let rkpm = 0;
  if (correctEvents.length > 1) {
    const rkpmTime = totalTime - initialSpeed;
    if (rkpmTime > 0) {
      rkpm = Math.round(((correctEvents.length - 1) / rkpmTime) * 60);
    }
  }

  return {
    word: event.word,
    initialSpeed,
    inputTime: totalTime,
    inputCharacterCount: correctEvents.length,
    kpm,
    rkpm,
    missCount
  };
}

/**
 * 正確率を計算する
 */
function calculateAccuracy(inputCount: number, missCount: number): number {
  const totalKeystrokes = inputCount + missCount;
  return totalKeystrokes > 0 ? (inputCount / totalKeystrokes) * 100 : 0;
}

/**
 * WordTypingEvent配列からPracticeResultを計算する
 */
export function calculatePracticeResult(
  events: WordTypingEvent[]
): PracticeResult {
  if (events.length === 0) {
    throw new Error("完了したワードがありません");
  }

  // 各ワードの結果を計算
  const wordResults = events.map(calculateWordResult);

  // 全体の集計値を計算
  const totalInputCount = wordResults.reduce(
    (sum, result) => sum + result.inputCharacterCount,
    0
  );
  const totalMissCount = wordResults.reduce(
    (sum, result) => sum + result.missCount,
    0
  );
  const totalTime = wordResults.reduce(
    (sum, result) => sum + result.inputTime,
    0
  );

  // 各指標を計算
  const accuracy = calculateAccuracy(totalInputCount, totalMissCount);
  const kpm =
    totalTime > 0 ? Math.round((totalInputCount / totalTime) * 60) : 0;

  // 初速の平均を計算
  const totalInitialSpeed = wordResults.reduce(
    (sum, result) => sum + result.initialSpeed,
    0
  );
  const initialSpeed = totalInitialSpeed / events.length;

  // RKPM計算: (全正解文字数 - ワード数) / (全体時間 - 全初速) * 60
  let rkpm = 0;
  if (totalInputCount > events.length) {
    const rkpmTime = totalTime - totalInitialSpeed;
    if (rkpmTime > 0) {
      rkpm = Math.round(((totalInputCount - events.length) / rkpmTime) * 60);
    }
  }

  // スコア計算（正確率 × KPM / 100）
  const score = Math.round(accuracy * (kpm / 100));

  return {
    score,
    inputTime: Math.round(totalTime * 100) / 100, // 小数点以下2桁
    inputCharacterCount: totalInputCount,
    missCount: totalMissCount,
    accuracy: Math.round(accuracy * 100) / 100, // 小数点以下2桁
    kpm,
    rkpm,
    initialSpeed: Math.round(initialSpeed * 1000) / 1000, // 小数点以下3桁
    wordResults
  };
}
