import { describe, it, expect } from "vitest";
import { calculateResults } from "./scoreCalculator";
import type { WordTypingInfo } from "../types";

describe("scoreCalculator", () => {
  const createMockData = (
    overrides: Partial<WordTypingInfo>[] = []
  ): WordTypingInfo[] => {
    const defaults = [
      {
        word: { displayText: "猫の寝顔", hiragana: "ねこのねがお" },
        startTime: 1000,
        firstInputTime: 1500, // 0.5秒後に初回入力
        completionTime: 3000, // 2秒で完了
        missCount: 0,
        inputKeys: "nekonegao" // 9文字
      },
      {
        word: { displayText: "夜更かし", hiragana: "よふかし" },
        startTime: 3000,
        firstInputTime: 3300, // 0.3秒後に初回入力
        completionTime: 5000, // 2秒で完了
        missCount: 0,
        inputKeys: "yofukashi" // 9文字
      }
    ];

    return defaults.map((defaultItem, index) => ({
      ...defaultItem,
      ...overrides[index]
    }));
  };

  describe("基本的な集計値", () => {
    it("入力文字数が正しく計算される", () => {
      const data = createMockData([
        { inputKeys: "abc" }, // 3文字
        { inputKeys: "defgh" } // 5文字
      ]);

      const result = calculateResults(data);
      expect(result.inputCharacterCount).toBe(8); // 3 + 5
    });

    it("ミス数が正しく計算される", () => {
      const data = createMockData([{ missCount: 2 }, { missCount: 3 }]);

      const result = calculateResults(data);
      expect(result.missCount).toBe(5); // 2 + 3
    });

    it("入力時間が正しく計算される（インターバルを除く）", () => {
      const data = createMockData([
        { startTime: 1000, completionTime: 3000 }, // 2秒
        { startTime: 4000, completionTime: 6500 } // 2.5秒
      ]);

      const result = calculateResults(data);
      expect(result.inputTime).toBe(4.5); // 2 + 2.5
    });
  });

  describe("正確率計算", () => {
    it("ミスがない場合は100%", () => {
      const data = createMockData([
        { inputKeys: "abc", missCount: 0 },
        { inputKeys: "def", missCount: 0 }
      ]);

      const result = calculateResults(data);
      expect(result.accuracy).toBe(100);
    });

    it("ミスがある場合の正確率計算", () => {
      const data = createMockData([
        { inputKeys: "abc", missCount: 1 }, // 入力3, ミス1
        { inputKeys: "defgh", missCount: 0 } // 入力5, ミス0
      ]);

      const result = calculateResults(data);
      // 正確率 = 8 / (8 + 1) * 100 = 88.89%
      expect(result.accuracy).toBe(88.89);
    });
  });

  describe("KPM計算", () => {
    it("基本的なKPM計算", () => {
      const data = createMockData([
        { inputKeys: "abcd", startTime: 1000, completionTime: 3000 }, // 4文字, 2秒
        { inputKeys: "efgh", startTime: 3000, completionTime: 4000 } // 4文字, 1秒
      ]);

      const result = calculateResults(data);
      // KPM = (8文字 / 3秒) * 60 = 160
      expect(result.kpm).toBe(160);
    });

    it("ワード別KPM計算", () => {
      const data = createMockData([
        { inputKeys: "abcdef", startTime: 1000, completionTime: 3000 } // 6文字, 2秒
      ]);

      const result = calculateResults(data);
      const wordResult = result.wordResults[0];
      // ワードKPM = (6文字 / 2秒) * 60 = 180
      expect(wordResult.kpm).toBe(180);
    });
  });

  describe("初速計算", () => {
    it("各ワードの初速の平均が計算される", () => {
      const data = createMockData([
        { startTime: 1000, firstInputTime: 1500 }, // 0.5秒
        { startTime: 3000, firstInputTime: 3200 } // 0.2秒
      ]);

      const result = calculateResults(data);
      // 初速平均 = (0.5 + 0.2) / 2 = 0.35
      expect(result.initialSpeed).toBe(0.35);
    });

    it("ワード別初速が正しく計算される", () => {
      const data = createMockData([
        { startTime: 1000, firstInputTime: 1600 } // 0.6秒
      ]);

      const result = calculateResults(data);
      const wordResult = result.wordResults[0];
      expect(wordResult.initialSpeed).toBe(0.6);
    });
  });

  describe("RKPM計算", () => {
    it("全体のRKPM計算", () => {
      const data = createMockData([
        {
          inputKeys: "abcd", // 4文字
          startTime: 1000,
          firstInputTime: 1500, // 初速0.5秒
          completionTime: 3000 // 全体2秒
        },
        {
          inputKeys: "efgh", // 4文字
          startTime: 3000,
          firstInputTime: 3200, // 初速0.2秒
          completionTime: 4000 // 全体1秒
        }
      ]);

      const result = calculateResults(data);
      // RKPM = ((8 - 2) / (3 - 0.7)) * 60 = (6 / 2.3) * 60 = 157（四捨五入）
      expect(result.rkpm).toBe(157);
    });

    it("ワード別RKPM計算", () => {
      const data = createMockData([
        {
          inputKeys: "abcdef", // 6文字
          startTime: 1000,
          firstInputTime: 1400, // 初速0.4秒
          completionTime: 3000 // 全体2秒
        }
      ]);

      const result = calculateResults(data);
      const wordResult = result.wordResults[0];
      // ワードRKPM = ((6 - 1) / (3000 - 1400) / 1000) * 60 = (5 / 1.6) * 60 = 188（四捨五入）
      expect(wordResult.rkpm).toBe(188);
    });

    it("1文字のワードではRKPMが0", () => {
      const data = createMockData([
        {
          inputKeys: "a", // 1文字
          startTime: 1000,
          firstInputTime: 1200,
          completionTime: 2000
        }
      ]);

      const result = calculateResults(data);
      const wordResult = result.wordResults[0];
      expect(wordResult.rkpm).toBe(0);
    });
  });

  describe("インターバルがある場合", () => {
    it("インターバル時間は入力時間に含まれない", () => {
      const data = [
        {
          word: { displayText: "ワード1", hiragana: "わーど1" },
          startTime: 1000,
          firstInputTime: 1500,
          completionTime: 3000, // 2秒で完了
          missCount: 0,
          inputKeys: "wa-do1"
        },
        {
          word: { displayText: "ワード2", hiragana: "わーど2" },
          startTime: 3500, // 500msインターバル後に開始
          firstInputTime: 3800,
          completionTime: 5500, // 2秒で完了
          missCount: 0,
          inputKeys: "wa-do2"
        }
      ];

      const result = calculateResults(data);
      // 入力時間 = (3000-1000)/1000 + (5500-3500)/1000 = 2 + 2 = 4秒
      // インターバル500msは含まれない
      expect(result.inputTime).toBe(4);
    });
  });

  describe("スコア計算", () => {
    it("スコアが正確率×KPM/100で計算される", () => {
      const data: WordTypingInfo[] = [
        {
          word: { displayText: "テスト", hiragana: "てすと" },
          startTime: 1000,
          firstInputTime: 1200,
          completionTime: 2000, // 1秒で完了
          missCount: 1,
          inputKeys: "abcd" // 4文字, 1ミス
        }
      ];

      const result = calculateResults(data);

      // 正確率 = 4 / (4 + 1) * 100 = 80%
      expect(result.accuracy).toBe(80);

      // KPM = (4 / 1) * 60 = 240
      expect(result.kpm).toBe(240);

      // スコア = 80 * (240 / 100) = 192
      expect(result.score).toBe(192);
    });
  });
});
