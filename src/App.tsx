import { useCallback } from "react";
import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { useTypingGame } from "./hooks/useTypingGame";
import type { PracticeResult } from "./types";

function App() {
  const { state, dispatch, handleKeyType } = useTypingGame();

  const handleCompleteWord = useCallback(() => {
    dispatch({ type: "COMPLETE_WORD" });
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESTART_GAME" });
  }, [dispatch]);

  const dummyResult: PracticeResult = {
    score: 500,
    inputTime: 30,
    inputCharacterCount: 300,
    missCount: 10,
    accuracy: 96.7,
    kpm: 600,
    rkpm: 700,
    initialSpeed: 0.5,
    wordResults: []
  };

  switch (state.gameState) {
    case "waiting":
      return <WaitingScreen />;

    case "countdown":
      return <CountdownScreen count={state.count} />;

    case "playing":
      return (
        <PlayingScreen
          currentWord={state.currentWord}
          currentWordIndex={state.currentWordIndex}
          totalWords={0}
          missCount={0}
          onKeyTyped={handleKeyType}
          onCompleted={handleCompleteWord}
        />
      );

    case "interval":
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-gray-900">次のワードへ...</div>
          </div>
        </div>
      );

    case "result":
      return <ResultScreen result={dummyResult} onRestart={handleReset} />;

    default:
      return <div>Unknown state</div>;
  }
}

export default App;
