import type { PracticeResult, WordResult, WordTypingInfo } from "../types";

/**
 * 正確率を計算する
 */
function calculateAccuracy({
  inputCount,
  missCount
}: {
  inputCount: number;
  missCount: number;
}): number {
  return (inputCount / (inputCount + missCount)) * 100;
}

/**
 * KPMを計算する
 */
function calculateKPM({
  inputCount,
  totalTime
}: {
  inputCount: number;
  totalTime: number;
}): number {
  return Math.round((inputCount / totalTime) * 60);
}

/**
 * 初速の合計を計算する
 */
function calculateTotalInitialSpeed(infos: WordTypingInfo[]): number {
  const initialSpeeds = infos.map(
    (info) => (info.firstInputTime - info.startTime) / 1000
  );
  return initialSpeeds.reduce((sum, speed) => sum + speed, 0);
}

/**
 * RKPMを計算する
 */
function calculateRKPM({
  inputCount,
  totalWordsCount,
  totalTime,
  totalInitialSpeed
}: {
  inputCount: number;
  totalWordsCount: number;
  totalTime: number;
  totalInitialSpeed: number;
}): number {
  return Math.round(
    ((inputCount - totalWordsCount) / (totalTime - totalInitialSpeed)) * 60
  );
}

/**
 * ワード別の結果を計算する
 */
function calculateWordResults(infos: WordTypingInfo[]): WordResult[] {
  return infos.map((info) => {
    const wordTime = (info.completionTime - info.startTime) / 1000;
    const initialSpeed = (info.firstInputTime - info.startTime) / 1000;
    const kpm = Math.round((info.inputKeys.length / wordTime) * 60);

    let rkpm = 0;
    if (info.inputKeys.length > 1) {
      const rkpmTime = (info.completionTime - info.firstInputTime) / 1000;
      if (rkpmTime > 0) {
        rkpm = Math.round(((info.inputKeys.length - 1) / rkpmTime) * 60);
      }
    }

    return {
      word: info.word,
      initialSpeed,
      kpm,
      rkpm,
      missCount: info.missCount
    };
  });
}

/**
 * タイピング練習の結果を計算する
 */
export function calculateResults(
  wordTypingInfos: WordTypingInfo[]
): PracticeResult {
  if (wordTypingInfos.length === 0) {
    throw new Error("完了したワードがありません");
  }

  const totalInputCharacterCount = wordTypingInfos.reduce(
    (sum, info) => sum + info.inputKeys.length,
    0
  );
  const totalMissCount = wordTypingInfos.reduce(
    (sum, info) => sum + info.missCount,
    0
  );
  const totalTime = wordTypingInfos.reduce(
    (sum, info) => sum + (info.completionTime - info.startTime) / 1000,
    0
  );

  // 各指標を計算
  const accuracy = calculateAccuracy({
    inputCount: totalInputCharacterCount,
    missCount: totalMissCount
  });
  const kpm = calculateKPM({ inputCount: totalInputCharacterCount, totalTime });
  const totalInitialSpeed = calculateTotalInitialSpeed(wordTypingInfos);
  const rkpm = calculateRKPM({
    inputCount: totalInputCharacterCount,
    totalWordsCount: wordTypingInfos.length,
    totalTime,
    totalInitialSpeed
  });
  const wordResults = calculateWordResults(wordTypingInfos);

  // スコア計算（正確率 × KPM / 100）
  const score = Math.round(accuracy * (kpm / 100));

  return {
    score,
    inputTime: totalTime,
    inputCharacterCount: totalInputCharacterCount,
    missCount: totalMissCount,
    accuracy: Math.round(accuracy * 100) / 100, // 小数点以下2桁
    kpm,
    rkpm,
    initialSpeed:
      Math.round((totalInitialSpeed / wordTypingInfos.length) * 1000) / 1000, // 小数点以下3桁
    wordResults
  };
}
