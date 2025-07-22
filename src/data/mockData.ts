import type { PracticeResult, WordResult, Word } from "../types";

// モック用の短いワードデータ（テスト用）
export const mockWords: Word[] = [
  {
    displayText: "猫の寝顔",
    hiragana: "ねこのねがお"
  },
  {
    displayText: "朝の散歩",
    hiragana: "あさのさんぽ"
  },
  {
    displayText: "お昼寝",
    hiragana: "おひるね"
  }
];

// モック用のワード別結果
export const mockWordResults: WordResult[] = [
  {
    word: mockWords[0],
    initialSpeed: 1.2,
    kpm: 180,
    rkpm: 200,
    missCount: 2
  },
  {
    word: mockWords[1],
    initialSpeed: 0.8,
    kpm: 220,
    rkpm: 240,
    missCount: 1
  },
  {
    word: mockWords[2],
    initialSpeed: 1.5,
    kpm: 160,
    rkpm: 180,
    missCount: 3
  }
];

// モック用の練習結果データ
export const mockPracticeResult: PracticeResult = {
  score: 85,
  inputTime: 45.7,
  inputCharacterCount: 24,
  missCount: 6,
  accuracy: 75.0,
  kpm: 187,
  rkpm: 206,
  initialSpeed: 1.17,
  wordResults: mockWordResults
};
