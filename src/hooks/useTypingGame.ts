import { useState, useCallback, useRef } from "react";
import { Word as HiggsinoWord } from "higgsino";
import type { Word, PracticeResult, WordTypingInfo } from "../types";
import { practiceWords } from "../data/words";
import { calculateResults } from "../lib/scoreCalculator";

// 動作確認用に2ワードに制限
const selectedWords = practiceWords.slice(0, 2);

type WaitingState = {
  gameState: "waiting";
};

type CountDownState = {
  gameState: "countdown";
  countdown: number;
};

type PlayingState = {
  gameState: "playing" | "interval";
  currentWordIndex: number;
  currentWord: Word;
  currentWordInfo: WordTypingInfo;
  wordTypingInfos: WordTypingInfo[];
};

type ResultState = {
  gameState: "result";
  wordTypingInfos: WordTypingInfo[];
};

type TypingGameState =
  | WaitingState
  | CountDownState
  | PlayingState
  | ResultState;

export const useTypingGame = () => {
  const [state, setState] = useState<TypingGameState>({
    gameState: "waiting"
  });

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const higgsinoWordRef = useRef<HiggsinoWord | null>(null);

  // カウントダウンを進める関数
  const advanceCountdown = useCallback(() => {
    setState((prev) => {
      if (prev.gameState !== "countdown") return prev;

      if (prev.countdown <= 1) {
        // 最初のワードの開始準備
        const firstWord = selectedWords[0];
        higgsinoWordRef.current = new HiggsinoWord(
          firstWord.displayText,
          firstWord.hiragana
        );

        const now = Date.now();
        const currentWordInfo: WordTypingInfo = {
          word: firstWord,
          startTime: now,
          firstInputTime: 0,
          completionTime: 0,
          missCount: 0,
          inputKeys: ""
        };

        return {
          gameState: "playing",
          currentWordIndex: 0,
          currentWord: firstWord,
          currentWordInfo,
          wordTypingInfos: []
        };
      }
      return { ...prev, countdown: prev.countdown - 1 };
    });
  }, []);

  // ゲーム開始
  const startGame = useCallback(() => {
    setState({ gameState: "countdown", countdown: 3 });

    const countdownInterval = setInterval(advanceCountdown, 1000);
    countdownRef.current = countdownInterval;

    setTimeout(() => {
      clearInterval(countdownInterval);
    }, 3000);
  }, [advanceCountdown]);

  // キー入力処理
  const handleKeyInput = useCallback((key: string) => {
    setState((prev) => {
      if (prev.gameState !== "playing" || !higgsinoWordRef.current) return prev;

      const result = higgsinoWordRef.current.typed(key);
      const now = Date.now();

      const updatedCurrentInfo = { ...prev.currentWordInfo };

      // 最初の正解入力の時間を記録
      if (!result.isMiss && updatedCurrentInfo.firstInputTime === 0) {
        updatedCurrentInfo.firstInputTime = now;
      }

      // 入力キーを記録（ミスでも記録）
      updatedCurrentInfo.inputKeys += key;

      if (result.isMiss) {
        // ミス
        updatedCurrentInfo.missCount += 1;
      }

      if (result.isFinish) {
        // ワード完了
        updatedCurrentInfo.completionTime = now;

        const nextIndex = prev.currentWordIndex + 1;
        if (nextIndex >= selectedWords.length) {
          // 全ワード完了 - 結果画面へ
          return {
            gameState: "result",
            wordTypingInfos: [...prev.wordTypingInfos, updatedCurrentInfo]
          };
        } else {
          // インターバル状態に移行
          const newState: PlayingState = {
            gameState: "interval",
            currentWordIndex: prev.currentWordIndex,
            currentWord: prev.currentWord,
            currentWordInfo: prev.currentWordInfo,
            wordTypingInfos: [...prev.wordTypingInfos, updatedCurrentInfo]
          };

          // 500msインターバル後に次のワードへ
          setTimeout(() => {
            setState((currentState) => {
              if (currentState.gameState !== "interval") return currentState;

              const nextWord = selectedWords[nextIndex];
              higgsinoWordRef.current = new HiggsinoWord(
                nextWord.displayText,
                nextWord.hiragana
              );

              const nextWordStartTime = Date.now();
              const nextWordInfo: WordTypingInfo = {
                word: nextWord,
                startTime: nextWordStartTime,
                firstInputTime: 0,
                completionTime: 0,
                missCount: 0,
                inputKeys: ""
              };

              return {
                gameState: "playing",
                currentWordIndex: nextIndex,
                currentWord: nextWord,
                currentWordInfo: nextWordInfo,
                wordTypingInfos: (currentState as PlayingState).wordTypingInfos
              };
            });
          }, 500);

          return newState;
        }
      }

      return {
        ...prev,
        currentWordInfo: updatedCurrentInfo
      };
    });
  }, []);

  // リセット
  const resetGame = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    higgsinoWordRef.current = null;
    setState({ gameState: "waiting" });
  }, []);

  // 結果計算
  const calculatePracticeResults = useCallback((): PracticeResult | null => {
    if (state.gameState !== "result") {
      return null;
    }

    try {
      return calculateResults(state.wordTypingInfos);
    } catch (error) {
      console.error("結果計算エラー:", error);
      return null;
    }
  }, [state]);

  return {
    // 状態
    state,
    higgsinoWord: higgsinoWordRef.current,
    totalWords: selectedWords.length,

    // アクション
    startGame,
    handleKeyInput,
    resetGame,
    calculateResults: calculatePracticeResults
  };
};
