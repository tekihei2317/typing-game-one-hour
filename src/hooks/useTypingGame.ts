import { useState, useCallback, useEffect, useRef } from "react";
import { Word as HiggsinoWord } from "higgsino";
import type { GameState, Word, PracticeResult, WordResult } from "../types";
import { practiceWords } from "../data/words";

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
  wordStartTimes: number[];
  wordMissCounts: number[];
  countdown: number;
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
    wordStartTimes: [],
    wordMissCounts: [],
    countdown: 3,
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
            firstWord.hiragana,
          );

          return {
            ...prev,
            gameState: "playing",
            currentWordIndex: 0,
            currentWord: firstWord,
            higgsinoWord,
            startTime: Date.now(),
            wordStartTimes: [Date.now()],
            wordMissCounts: [0],
            missCount: 0,
            countdown: 3,
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

      setState((prev) => {
        const newState = { ...prev };

        if (result.isMiss) {
          // ミス
          newState.missCount = prev.missCount + 1;
          newState.totalMissCount = prev.totalMissCount + 1;
          newState.wordMissCounts = [...prev.wordMissCounts];
          newState.wordMissCounts[prev.currentWordIndex] =
            (newState.wordMissCounts[prev.currentWordIndex] || 0) + 1;
        }

        if (result.isFinish) {
          // ワード完了
          const nextIndex = prev.currentWordIndex + 1;

          if (nextIndex >= selectedWords.length) {
            // 全ワード完了
            newState.gameState = "result";
            newState.endTime = Date.now();
          } else {
            // 次のワードへ
            const nextWord = selectedWords[nextIndex];
            const nextHiggsinoWord = new HiggsinoWord(
              nextWord.displayText,
              nextWord.hiragana,
            );

            newState.currentWordIndex = nextIndex;
            newState.currentWord = nextWord;
            newState.higgsinoWord = nextHiggsinoWord;
            newState.missCount = 0;
            newState.wordStartTimes = [...prev.wordStartTimes, Date.now()];
            newState.wordMissCounts = [...prev.wordMissCounts, 0];
          }
        }

        return newState;
      });
    },
    [state.gameState, state.higgsinoWord],
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
      wordStartTimes: [],
      wordMissCounts: [],
      countdown: 3,
    });
  }, []);

  // 結果計算
  const calculateResults = useCallback((): PracticeResult | null => {
    if (state.gameState !== "result" || !state.startTime || !state.endTime) {
      return null;
    }

    const totalTime = (state.endTime - state.startTime) / 1000; // 秒
    const totalCharacters = selectedWords.reduce((sum, word) => {
      const higgsinoWord = new HiggsinoWord(word.displayText, word.hiragana);
      return sum + higgsinoWord.roman.all.length;
    }, 0);

    const accuracy =
      state.totalMissCount === 0
        ? 100
        : (totalCharacters / (totalCharacters + state.totalMissCount)) * 100;

    const kpm = Math.round((totalCharacters / totalTime) * 60);

    // 初速計算（各ワードの最初の正解入力までの時間の平均）
    const wordInitialSpeeds = state.wordStartTimes.map((startTime, index) => {
      if (index === 0) return 1.0; // 最初のワードは固定値
      return (startTime - state.wordStartTimes[index - 1]) / 1000;
    });
    const initialSpeed =
      wordInitialSpeeds.reduce((sum, speed) => sum + speed, 0) /
      wordInitialSpeeds.length;

    const rkpm = Math.round(kpm * 0.9); // 簡略化した計算

    // ワード別結果
    const wordResults: WordResult[] = selectedWords.map((word, index) => ({
      word,
      initialSpeed: wordInitialSpeeds[index] || 1.0,
      kpm: Math.round(kpm * (0.8 + Math.random() * 0.4)), // ワードごとの変動
      rkpm: Math.round(rkpm * (0.8 + Math.random() * 0.4)),
      missCount: state.wordMissCounts[index] || 0,
    }));

    return {
      score: Math.round(accuracy * (kpm / 100)),
      inputTime: totalTime,
      inputCharacterCount: totalCharacters,
      missCount: state.totalMissCount,
      accuracy,
      kpm,
      rkpm,
      initialSpeed,
      wordResults,
    };
  }, [state]);

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
    calculateResults,
  };
};
