import { useEffect } from "react";
import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { useTypingGame } from "./hooks/useTypingGame";

function App() {
  const {
    state,
    higgsinoWord,
    totalWords,
    startGame,
    handleKeyInput,
    resetGame,
    calculateResults
  } = useTypingGame();

  // キーボードイベントリスナー
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (state.gameState === "waiting" && event.code === "Space") {
        event.preventDefault();
        startGame();
      } else if (state.gameState === "playing") {
        event.preventDefault();
        handleKeyInput(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.gameState, startGame, handleKeyInput]);

  switch (state.gameState) {
    case "waiting":
      return <WaitingScreen onStart={startGame} />;

    case "countdown":
      return <CountdownScreen count={state.countdown} />;

    case "playing":
      return (
        <PlayingScreen
          currentWord={state.currentWord}
          currentWordIndex={state.currentWordIndex}
          totalWords={totalWords}
          higgsinoWord={higgsinoWord!}
          missCount={state.currentWordInfo.missCount}
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

    case "result": {
      const result = calculateResults();
      return result ? (
        <ResultScreen result={result} onRestart={resetGame} />
      ) : (
        <div>計算中...</div>
      );
    }

    default:
      return <div>Unknown state</div>;
  }
}

export default App;
