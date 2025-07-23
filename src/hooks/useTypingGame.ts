import { useCallback, useEffect, useReducer } from "react";
import {
  type KeyTypeEvent,
  type Word,
  // type PracticeResult,
  // type WordTypingInfo,
  type WordTypingEvent,
  createNewTypingEvent
} from "../types";
import { practiceWords } from "../data/words";

// 動作確認用に2ワードに制限
const selectedWords = practiceWords.slice(0, 2);

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
      events: {
        current: WordTypingEvent;
        past: WordTypingEvent[];
      };
    }
  | {
      gameState: "interval";
      currentWordIndex: number;
      events: {
        past: WordTypingEvent[];
      };
    }
  | {
      gameState: "result";
      result: "OK";
      // result: PracticeResult;
    };

type Action =
  | { type: "START_GAME" }
  | { type: "COUNTDOWN_TICK"; timestamp: Date }
  | { type: "KEY_TYPED"; event: KeyTypeEvent }
  | { type: "COMPLETE_WORD" }
  | { type: "START_NEXT_WORD"; timestamp: Date }
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
        return { ...state, count: nextCount };
      } else {
        const word = selectedWords[0];
        return {
          gameState: "playing",
          currentWord: word,
          currentWordIndex: 0,
          events: {
            current: createNewTypingEvent(word, action.timestamp),
            past: []
          }
        };
      }
    }
  } else if (action.type === "KEY_TYPED") {
    if (state.gameState === "playing") {
      return {
        ...state,
        events: {
          current: {
            ...state.events.current,
            keyTypeEvents: [...state.events.current.keyTypeEvents, action.event]
          },
          past: state.events.past
        }
      };
    }
  } else if (action.type === "COMPLETE_WORD") {
    if (state.gameState === "playing") {
      if (state.currentWordIndex < selectedWords.length - 1) {
        return {
          ...state,
          gameState: "interval",
          events: { past: [...state.events.past, state.events.current] }
        };
      } else {
        return { gameState: "result", result: "OK" };
      }
    }
  } else if (action.type === "START_NEXT_WORD") {
    if (state.gameState === "interval") {
      const nextIndex = state.currentWordIndex + 1;
      const word = selectedWords[nextIndex];
      return {
        gameState: "playing",
        currentWord: word,
        currentWordIndex: nextIndex,
        events: {
          current: createNewTypingEvent(word, action.timestamp),
          past: state.events.past
        }
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
  handleKeyType: (event: KeyTypeEvent) => void;
};

export function useTypingGame(): UseTypingGameReturn {
  const [state, dispatch] = useReducer(gameReducer, { gameState: "waiting" });

  const handleKeyType = useCallback((event: KeyTypeEvent) => {
    dispatch({ type: "KEY_TYPED", event });
  }, []);

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
      dispatch({ type: "COUNTDOWN_TICK", timestamp: new Date() });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.gameState, dispatch]);

  // インターバルを終了する
  useEffect(() => {
    if (state.gameState !== "interval") return;

    const timeoutId = setTimeout(() => {
      dispatch({ type: "START_NEXT_WORD", timestamp: new Date() });
    }, 500);

    return () => clearTimeout(timeoutId);
  });

  return {
    state,
    dispatch,
    handleKeyType
  };
}
