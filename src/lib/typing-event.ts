import type { Word } from "../types";

/**
 * キータイプの結果
 */
export type KeyTypeResult = { isCorrect: boolean; isCompleted: boolean };

/**
 * キータイプイベント
 */
export type KeyTypeEvent = {
  pressedKey: string;
  timestamp: Date;
  result: KeyTypeResult;
};

/**
 * ワード別のタイピングイベント
 */
export type WordTypingEvent = {
  word: Word;
  displayedAt: Date;
  keyTypeEvents: KeyTypeEvent[];
};

/**
 * ワード別のタイピングイベントを作る
 */
export function createNewTypingEvent(
  word: Word,
  timestamp: Date
): WordTypingEvent {
  return {
    word,
    displayedAt: timestamp,
    keyTypeEvents: []
  };
}

/**
 * キータイプイベントを作る
 */
export function makeKeyTypeEvent({
  pressedKey,
  result,
  timestamp
}: {
  pressedKey: string;
  result: { isMiss: boolean; isFinish: boolean };
  timestamp: Date;
}): KeyTypeEvent {
  return {
    pressedKey,
    timestamp,
    result: { isCorrect: !result.isMiss, isCompleted: result.isFinish }
  };
}
