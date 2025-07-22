import { useState, useCallback, useEffect, useRef } from "react";
import { Word as HiggsinoWord } from "higgsino";
import type { GameState, Word, PracticeResult, WordTypingInfo } from "../types";
import { practiceWords } from "../data/words";
import { calculateResults } from "../lib/scoreCalculator";

// 動作確認用に2ワードに制限
const selectedWords = practiceWords.slice(0, 2);

interface TypingGameState {
  gameState: GameState;
  currentWordIndex: number;
  currentWord: Word | null;
  higgsinoWord: HiggsinoWord | null;
  startTime: number | null;
  endTime: number | null;
  elapsedTime: number;
  missCount: number;
  totalMissCount: number;
  countdown: number;
  wordTypingInfos: WordTypingInfo[];
}

export const useTypingGame = () => {
  const [state, setState] = useState<TypingGameState>({
    gameState: "waiting",
    currentWordIndex: 0,
    currentWord: null,
    higgsinoWord: null,
    startTime: null,
    endTime: null,
    elapsedTime: 0,
    missCount: 0,
    totalMissCount: 0,
    countdown: 3,
    wordTypingInfos: []
  });

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // タイマーの更新
  const updateTimer = useCallback(() => {
    if (state.gameState === "playing" && state.startTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - state.startTime) / 1000);
      setState((prev) => ({ ...prev, elapsedTime: elapsed }));
    }
  }, [state.gameState, state.startTime]);

  // タイマー開始
  useEffect(() => {
    if (state.gameState === "playing") {
      timerRef.current = setInterval(updateTimer, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.gameState, updateTimer]);

  // ゲーム開始
  const startGame = useCallback(() => {
    setState((prev) => ({ ...prev, gameState: "countdown", countdown: 3 }));

    const countdownInterval = setInterval(() => {
      setState((prev) => {
        if (prev.countdown <= 1) {
          // カウントダウン終了、ゲーム開始
          const firstWord = selectedWords[0];
          const higgsinoWord = new HiggsinoWord(
            firstWord.displayText,
            firstWord.hiragana
          );

          const now = Date.now();
          const wordTypingInfo: WordTypingInfo = {
            word: firstWord,
            startTime: now,
            firstInputTime: 0,
            completionTime: 0,
            missCount: 0,
            inputKeys: ""
          };

          return {
            ...prev,
            gameState: "playing",
            currentWordIndex: 0,
            currentWord: firstWord,
            higgsinoWord,
            startTime: now,
            missCount: 0,
            countdown: 3,
            wordTypingInfos: [wordTypingInfo]
          };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    countdownRef.current = countdownInterval;

    setTimeout(() => {
      clearInterval(countdownInterval);
    }, 3000);
  }, []);

  // キー入力処理
  const handleKeyInput = useCallback(
    (key: string) => {
      if (state.gameState !== "playing" || !state.higgsinoWord) return;

      const result = state.higgsinoWord.typed(key);
      const now = Date.now();

      setState((prev) => {
        const newState = { ...prev };
        const currentInfo = { ...prev.wordTypingInfos[prev.currentWordIndex] };

        // 最初の正解入力の時間を記録
        if (!result.isMiss && currentInfo.firstInputTime === 0) {
          currentInfo.firstInputTime = now;
        }

        // 入力キーを記録（ミスでも記録）
        currentInfo.inputKeys += key;

        if (result.isMiss) {
          // ミス
          newState.missCount = prev.missCount + 1;
          newState.totalMissCount = prev.totalMissCount + 1;
          currentInfo.missCount += 1;
        }

        // 現在のワード情報を更新
        newState.wordTypingInfos = [...prev.wordTypingInfos];
        newState.wordTypingInfos[prev.currentWordIndex] = currentInfo;

        if (result.isFinish) {
          // ワード完了
          currentInfo.completionTime = now;
          newState.wordTypingInfos[prev.currentWordIndex] = currentInfo;
          const nextIndex = prev.currentWordIndex + 1;

          if (nextIndex >= selectedWords.length) {
            // 全ワード完了
            newState.gameState = "result";
            newState.endTime = now;
          } else {
            // インターバル状態に移行
            newState.gameState = "interval";

            // 500msインターバル後に次のワードへ
            setTimeout(() => {
              setState((currentState) => {
                const nextWord = selectedWords[nextIndex];
                const nextHiggsinoWord = new HiggsinoWord(
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
                  ...currentState,
                  gameState: "playing",
                  currentWordIndex: nextIndex,
                  currentWord: nextWord,
                  higgsinoWord: nextHiggsinoWord,
                  missCount: 0,
                  wordTypingInfos: [
                    ...currentState.wordTypingInfos,
                    nextWordInfo
                  ]
                };
              });
            }, 500);
          }
        }

        return newState;
      });
    },
    [state.gameState, state.higgsinoWord]
  );

  // リセット
  const resetGame = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setState({
      gameState: "waiting",
      currentWordIndex: 0,
      currentWord: null,
      higgsinoWord: null,
      startTime: null,
      endTime: null,
      elapsedTime: 0,
      missCount: 0,
      totalMissCount: 0,
      countdown: 3,
      wordTypingInfos: []
    });
  }, []);

  // 結果計算
  const calculatePracticeResults = useCallback((): PracticeResult | null => {
    if (state.gameState !== "result" || state.wordTypingInfos.length === 0) {
      return null;
    }

    try {
      console.log("結果計算開始:");
      state.wordTypingInfos.forEach((info, index) => {
        const initialSpeed = info.firstInputTime
          ? (info.firstInputTime - info.startTime) / 1000
          : null;
        console.log(`ワード${index + 1}: ${info.word.displayText}`);
        console.log(
          `  開始時間: ${new Date(info.startTime).toLocaleTimeString()}`
        );
        console.log(
          `  初回入力時間: ${info.firstInputTime ? new Date(info.firstInputTime).toLocaleTimeString() : "未入力"}`
        );
        console.log(
          `  完了時間: ${info.completionTime ? new Date(info.completionTime).toLocaleTimeString() : "未完了"}`
        );
        console.log(
          `  初速: ${initialSpeed ? initialSpeed.toFixed(3) + "秒" : "計算不可"}`
        );
        console.log(`  入力キー: "${info.inputKeys}"`);
        console.log(`  ミス数: ${info.missCount}`);
      });

      const result = calculateResults(state.wordTypingInfos);
      console.log("計算結果:", result);
      return result;
    } catch (error) {
      console.error("結果計算エラー:", error);
      console.error("入力データ:", state.wordTypingInfos);
      return null;
    }
  }, [state.gameState, state.wordTypingInfos]);

  return {
    // 状態
    gameState: state.gameState,
    currentWordIndex: state.currentWordIndex,
    currentWord: state.currentWord,
    higgsinoWord: state.higgsinoWord,
    elapsedTime: state.elapsedTime,
    missCount: state.missCount,
    totalMissCount: state.totalMissCount,
    countdown: state.countdown,
    totalWords: selectedWords.length,

    // アクション
    startGame,
    handleKeyInput,
    resetGame,
    calculateResults: calculatePracticeResults
  };
};
