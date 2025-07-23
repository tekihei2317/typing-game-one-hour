import { useEffect, useReducer } from "react";
import type { Word, PracticeResult, WordTypingInfo } from "../types";
import { practiceWords } from "../data/words";

// 動作確認用に2ワードに制限
const selectedWords = practiceWords.slice(0, 2);

// type WordInfo = {
//   displayText: string;
//   hiragana: string;
//   roman: {
//     typed: string;
//     untyped: string;
//   };
// };

// type PlayInfo = {
//   totalMissCount: string;
//   wordIndex: number;
//   wordCount: number;
// };

type State =
  | { gameState: "waiting" }
  | {
      gameState: "countdown";
      count: number;
    }
  | {
      gameState: "playing";
      currentWord: Word;
      currentWordIndex: number;
    }
  | {
      gameState: "interval";
      currentWordIndex: number;
    }
  | {
      gameState: "result";
      result: "OK";
      // result: PracticeResult;
    };

type Action =
  | { type: "START_GAME" }
  | { type: "COUNTDOWN_TICK" }
  | { type: "COMPLETE_WORD" }
  | { type: "START_NEXT_WORD" }
  | { type: "RESTART_GAME" };

function gameReducer(state: State, action: Action): State {
  if (action.type === "START_GAME") {
    if (state.gameState === "waiting") {
      return { gameState: "countdown", count: 1 };
    }
  } else if (action.type === "COUNTDOWN_TICK") {
    if (state.gameState === "countdown") {
      const nextCount = state.count - 1;
      if (nextCount > 0) {
        return { gameState: "countdown", count: nextCount };
      } else {
        return {
          gameState: "playing",
          currentWord: selectedWords[0],
          currentWordIndex: 0
        };
      }
    }
  } else if (action.type === "COMPLETE_WORD") {
    if (state.gameState === "playing") {
      if (state.currentWordIndex < selectedWords.length - 1) {
        return { ...state, gameState: "interval" };
      } else {
        return { gameState: "result", result: "OK" };
      }
    }
  } else if (action.type === "START_NEXT_WORD") {
    if (state.gameState === "interval") {
      const nextIndex = state.currentWordIndex + 1;
      return {
        gameState: "playing",
        currentWord: selectedWords[nextIndex],
        currentWordIndex: nextIndex
      };
    }
  } else if (action.type === "RESTART_GAME") {
    return { gameState: "waiting" };
  }
  return state;
}

type UseTypingGameReturn = {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
  // totalWords: number;
  // startGame: () => void;
  // resetGame: () => void;
  // calculateResults: () => PracticeResult | null;
};

export function useTypingGame(): UseTypingGameReturn {
  const [state, dispatch] = useReducer(gameReducer, { gameState: "waiting" });

  // キーボード入力を受け取る
  useEffect(() => {
    if (state.gameState !== "waiting") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // スペースキーでスタート
      if (event.key === " ") {
        dispatch({ type: "START_GAME" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.gameState]);

  // カウントダウン
  useEffect(() => {
    if (state.gameState !== "countdown") return;

    const intervalId = setInterval(() => {
      dispatch({ type: "COUNTDOWN_TICK" });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.gameState, dispatch]);

  // インターバルを終了する
  useEffect(() => {
    if (state.gameState !== "interval") return;

    const timeoutId = setTimeout(() => {
      dispatch({ type: "START_NEXT_WORD" });
    }, 500);

    return () => clearTimeout(timeoutId);
  });

  return {
    state,
    dispatch
  };
}
