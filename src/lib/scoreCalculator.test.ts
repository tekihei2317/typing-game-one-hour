import { describe, it, expect } from "vitest";
import { calculateResults } from "./scoreCalculator";
import type { WordTypingInfo } from "../types";

describe("scoreCalculator", () => {
  it("2ワードの完了時に正しく結果を計算する", () => {
    const mockWordTypingInfos: WordTypingInfo[] = [
      {
        word: { displayText: "猫の寝顔", hiragana: "ねこのねがお" },
        startTime: 1000,
        firstInputTime: 1500, // 0.5秒後に初回入力
        completionTime: 3000, // 2秒で完了
        missCount: 1,
        inputKeys: "nekonone", // 8文字
      },
      {
        word: { displayText: "夜更かし", hiragana: "よふかし" },
        startTime: 3000,
        firstInputTime: 3300, // 0.3秒後に初回入力
        completionTime: 5000, // 2秒で完了
        missCount: 0,
        inputKeys: "yofuka", // 6文字
      },
    ];

    const result = calculateResults(mockWordTypingInfos);

    expect(result).toBeDefined();
    expect(result.wordResults).toHaveLength(2);

    // 各ワードの結果を確認
    const firstWord = result.wordResults[0];
    expect(firstWord.word.displayText).toBe("猫の寝顔");
    expect(firstWord.initialSpeed).toBe(0.5); // (1500 - 1000) / 1000
    expect(firstWord.missCount).toBe(1);

    const secondWord = result.wordResults[1];
    expect(secondWord.word.displayText).toBe("夜更かし");
    expect(secondWord.initialSpeed).toBe(0.3); // (3300 - 3000) / 1000
    expect(secondWord.missCount).toBe(0);

    // 全体の結果
    expect(result.missCount).toBe(1); // 1 + 0
    expect(result.inputCharacterCount).toBe(14); // 8 + 6
    expect(result.inputTime).toBe(4); // (5000 - 1000) / 1000

    // KPM計算: (14 / 4) * 60 = 210
    expect(result.kpm).toBe(210);

    // 初速平均: (0.5 + 0.3) / 2 = 0.4
    expect(result.initialSpeed).toBe(0.4);
  });

  it("完了していないワードがある場合でも正しく動作する", () => {
    const mockWordTypingInfos: WordTypingInfo[] = [
      {
        word: { displayText: "猫の寝顔", hiragana: "ねこのねがお" },
        startTime: 1000,
        firstInputTime: 1500,
        completionTime: 3000,
        missCount: 0,
        inputKeys: "nekonone",
      },
      {
        word: { displayText: "夜更かし", hiragana: "よふかし" },
        startTime: 3000,
        firstInputTime: null, // 未入力
        completionTime: null, // 未完了
        missCount: 2,
        inputKeys: "yo",
      },
    ];

    const result = calculateResults(mockWordTypingInfos);

    // 完了したワードのみが結果に含まれる
    expect(result.wordResults).toHaveLength(1);
    expect(result.wordResults[0].word.displayText).toBe("猫の寝顔");
  });
});
