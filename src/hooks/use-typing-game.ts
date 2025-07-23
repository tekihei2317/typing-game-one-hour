import { useCallback, useReducer } from "react";
import type { Word, PracticeResult } from "../types";
import {
  createNewTypingEvent,
  type KeyTypeEvent,
  type WordTypingEvent
} from "../lib/typing-event";
import { practiceWords } from "../data/words";
import { calculatePracticeResult } from "../lib/calculate-score";

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
      result: PracticeResult;
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
        const result = calculatePracticeResult([
          ...state.events.past,
          state.events.current
        ]);
        return { gameState: "result", result };
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
  startGame: () => void;
  tickCountDown: (timestamp: Date) => void;
  completeWord: () => void;
  startNextWord: (timestamp: Date) => void;
  resetGame: () => void;
  recordKeyType: (event: KeyTypeEvent) => void;
};

export function useTypingGame(): UseTypingGameReturn {
  const [state, dispatch] = useReducer(gameReducer, { gameState: "waiting" });

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const tickCountDown = useCallback((timestamp: Date) => {
    dispatch({ type: "COUNTDOWN_TICK", timestamp });
  }, []);

  const recordKeyType = useCallback((event: KeyTypeEvent) => {
    dispatch({ type: "KEY_TYPED", event });
  }, []);

  const completeWord = useCallback(() => {
    dispatch({ type: "COMPLETE_WORD" });
  }, []);

  const startNextWord = useCallback((timestamp: Date) => {
    dispatch({ type: "START_NEXT_WORD", timestamp });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESTART_GAME" });
  }, []);

  return {
    state,
    dispatch,
    startGame,
    tickCountDown,
    recordKeyType,
    completeWord,
    startNextWord,
    resetGame
  };
}
