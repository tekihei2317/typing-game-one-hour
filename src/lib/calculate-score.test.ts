import { describe, it, expect } from "vitest";
import { calculatePracticeResult } from "./calculate-score";
import type { WordTypingEvent } from "./typing-event";
import type { Word } from "../types";

describe("calculatePracticeResult", () => {
  const createMockEvent = (
    word: Word,
    displayedAt: Date,
    keyEvents: Array<{
      pressedKey: string;
      timestamp: Date;
      isCorrect: boolean;
      isCompleted?: boolean;
    }>
  ): WordTypingEvent => ({
    word,
    displayedAt,
    keyTypeEvents: keyEvents.map((event) => ({
      pressedKey: event.pressedKey,
      timestamp: event.timestamp,
      result: {
        isCorrect: event.isCorrect,
        isCompleted: event.isCompleted || false
      }
    }))
  });

  describe("基本的な計算", () => {
    it("1ワードの基本的な結果が正しく計算される", () => {
      const word = { displayText: "猫", hiragana: "ねこ" };
      const startTime = new Date(1000);

      const event = createMockEvent(word, startTime, [
        { pressedKey: "n", timestamp: new Date(1500), isCorrect: true }, // 初速0.5秒
        { pressedKey: "e", timestamp: new Date(1700), isCorrect: true },
        { pressedKey: "k", timestamp: new Date(1900), isCorrect: true },
        {
          pressedKey: "o",
          timestamp: new Date(2000),
          isCorrect: true,
          isCompleted: true
        } // 全体1秒
      ]);

      const result = calculatePracticeResult([event]);

      expect(result.inputCharacterCount).toBe(4);
      expect(result.missCount).toBe(0);
      expect(result.accuracy).toBe(100);
      expect(result.inputTime).toBe(1); // (2000-1000)/1000
      expect(result.kpm).toBe(240); // (4/1)*60
      expect(result.initialSpeed).toBe(0.5); // (1500-1000)/1000

      const wordResult = result.wordResults[0];
      expect(wordResult.inputTime).toBe(1);
      expect(wordResult.inputCharacterCount).toBe(4);
      expect(wordResult.initialSpeed).toBe(0.5);
      expect(wordResult.kpm).toBe(240);
    });

    it("ミスがある場合の計算", () => {
      const word = { displayText: "猫", hiragana: "ねこ" };
      const startTime = new Date(1000);

      const event = createMockEvent(word, startTime, [
        { pressedKey: "n", timestamp: new Date(1200), isCorrect: true },
        { pressedKey: "x", timestamp: new Date(1300), isCorrect: false }, // ミス
        { pressedKey: "e", timestamp: new Date(1400), isCorrect: true },
        { pressedKey: "k", timestamp: new Date(1600), isCorrect: true },
        { pressedKey: "y", timestamp: new Date(1700), isCorrect: false }, // ミス
        {
          pressedKey: "o",
          timestamp: new Date(1800),
          isCorrect: true,
          isCompleted: true
        }
      ]);

      const result = calculatePracticeResult([event]);

      expect(result.inputCharacterCount).toBe(4); // 正解のみ
      expect(result.missCount).toBe(2);
      expect(result.accuracy).toBe(66.67); // 4/(4+2)*100 = 66.67%
      expect(result.inputTime).toBe(0.8); // (1800-1000)/1000
      expect(result.kpm).toBe(300); // (4/0.8)*60
      expect(result.initialSpeed).toBe(0.2); // (1200-1000)/1000
    });
  });

  describe("複数ワードの計算", () => {
    it("2ワードの結果が正しく集計される", () => {
      const word1 = { displayText: "猫", hiragana: "ねこ" };
      const word2 = { displayText: "犬", hiragana: "いぬ" };

      const event1 = createMockEvent(word1, new Date(1000), [
        { pressedKey: "n", timestamp: new Date(1300), isCorrect: true }, // 初速0.3秒
        { pressedKey: "e", timestamp: new Date(1500), isCorrect: true },
        { pressedKey: "k", timestamp: new Date(1700), isCorrect: true },
        { pressedKey: "o", timestamp: new Date(1800), isCorrect: true } // 全体0.8秒
      ]);

      const event2 = createMockEvent(word2, new Date(2000), [
        { pressedKey: "i", timestamp: new Date(2200), isCorrect: true }, // 初速0.2秒
        { pressedKey: "x", timestamp: new Date(2300), isCorrect: false }, // ミス
        { pressedKey: "n", timestamp: new Date(2400), isCorrect: true },
        { pressedKey: "u", timestamp: new Date(2500), isCorrect: true } // 全体0.5秒
      ]);

      const result = calculatePracticeResult([event1, event2]);

      expect(result.inputCharacterCount).toBe(7); // 4 + 3
      expect(result.missCount).toBe(1);
      expect(result.accuracy).toBe(87.5); // 7/(7+1)*100
      expect(result.inputTime).toBe(1.3); // 0.8 + 0.5
      expect(result.kpm).toBe(323); // Math.round((7/1.3)*60)
      expect(result.initialSpeed).toBe(0.25); // (0.3+0.2)/2
    });
  });

  describe("RKPM計算", () => {
    it("全体のRKPM計算", () => {
      const word = { displayText: "テスト", hiragana: "てすと" };
      const startTime = new Date(1000);

      const event = createMockEvent(word, startTime, [
        { pressedKey: "t", timestamp: new Date(1400), isCorrect: true }, // 初速0.4秒
        { pressedKey: "e", timestamp: new Date(1600), isCorrect: true },
        { pressedKey: "s", timestamp: new Date(1800), isCorrect: true },
        { pressedKey: "u", timestamp: new Date(2000), isCorrect: true },
        { pressedKey: "t", timestamp: new Date(2200), isCorrect: true },
        { pressedKey: "o", timestamp: new Date(2400), isCorrect: true } // 全体1.4秒
      ]);

      const result = calculatePracticeResult([event]);

      // RKPM = ((6-1) / (1.4-0.4)) * 60 = (5/1) * 60 = 300
      expect(result.rkpm).toBe(300);

      const wordResult = result.wordResults[0];
      expect(wordResult.rkpm).toBe(300);
    });

    it("1文字のワードではRKPMが0", () => {
      const word = { displayText: "あ", hiragana: "あ" };
      const startTime = new Date(1000);

      const event = createMockEvent(word, startTime, [
        { pressedKey: "a", timestamp: new Date(1500), isCorrect: true }
      ]);

      const result = calculatePracticeResult([event]);

      expect(result.rkpm).toBe(0);
      expect(result.wordResults[0].rkpm).toBe(0);
    });

    it("複数ワードでのRKPM計算", () => {
      const word1 = { displayText: "猫", hiragana: "ねこ" };
      const word2 = { displayText: "犬", hiragana: "いぬ" };

      const event1 = createMockEvent(word1, new Date(1000), [
        { pressedKey: "n", timestamp: new Date(1500), isCorrect: true }, // 初速0.5秒
        { pressedKey: "e", timestamp: new Date(1700), isCorrect: true },
        { pressedKey: "k", timestamp: new Date(1900), isCorrect: true },
        { pressedKey: "o", timestamp: new Date(2000), isCorrect: true } // 全体1秒
      ]);

      const event2 = createMockEvent(word2, new Date(3000), [
        { pressedKey: "i", timestamp: new Date(3300), isCorrect: true }, // 初速0.3秒
        { pressedKey: "n", timestamp: new Date(3500), isCorrect: true },
        { pressedKey: "u", timestamp: new Date(3600), isCorrect: true } // 全体0.6秒
      ]);

      const result = calculatePracticeResult([event1, event2]);

      // 全体RKPM = ((7-2) / (1.6-0.8)) * 60 = (5/0.8) * 60 = 375
      expect(result.rkpm).toBe(375);
    });
  });

  describe("スコア計算", () => {
    it("スコアが正確率×KPM/100で計算される", () => {
      const word = { displayText: "テスト", hiragana: "てすと" };
      const startTime = new Date(1000);

      const event = createMockEvent(word, startTime, [
        { pressedKey: "t", timestamp: new Date(1200), isCorrect: true },
        { pressedKey: "e", timestamp: new Date(1400), isCorrect: true },
        { pressedKey: "x", timestamp: new Date(1500), isCorrect: false }, // ミス
        { pressedKey: "s", timestamp: new Date(1600), isCorrect: true },
        { pressedKey: "u", timestamp: new Date(1800), isCorrect: true },
        { pressedKey: "t", timestamp: new Date(2000), isCorrect: true },
        { pressedKey: "o", timestamp: new Date(2200), isCorrect: true } // 全体1.2秒
      ]);

      const result = calculatePracticeResult([event]);

      // 正解6文字、ミス1回、正確率 = 6/(6+1)*100 = 85.71%
      expect(result.accuracy).toBe(85.71);

      // KPM = (6/1.2)*60 = 300
      expect(result.kpm).toBe(300);

      // スコア = 85.71 * (300/100) = 257（四捨五入）
      expect(result.score).toBe(257);
    });
  });

  describe("エッジケース", () => {
    it("空の配列では例外が発生する", () => {
      expect(() => calculatePracticeResult([])).toThrow(
        "完了したワードがありません"
      );
    });

    it("正解文字がないワードでも処理される", () => {
      const word = { displayText: "テスト", hiragana: "てすと" };
      const startTime = new Date(1000);

      const event = createMockEvent(word, startTime, [
        { pressedKey: "x", timestamp: new Date(1100), isCorrect: false },
        { pressedKey: "y", timestamp: new Date(1200), isCorrect: false }
      ]);

      const result = calculatePracticeResult([event]);

      expect(result.inputCharacterCount).toBe(0);
      expect(result.missCount).toBe(2);
      expect(result.accuracy).toBe(0);
      expect(result.kpm).toBe(0);

      const wordResult = result.wordResults[0];
      expect(wordResult.inputTime).toBe(0);
      expect(wordResult.inputCharacterCount).toBe(0);
      expect(wordResult.initialSpeed).toBe(0);
      expect(wordResult.kpm).toBe(0);
      expect(wordResult.rkpm).toBe(0);
    });
  });
});
