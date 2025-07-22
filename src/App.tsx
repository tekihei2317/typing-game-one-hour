import { useEffect } from "react";
import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { useTypingGame } from "./hooks/useTypingGame";

function App() {
  const {
    gameState,
    currentWordIndex,
    currentWord,
    higgsinoWord,
    elapsedTime,
    missCount,
    countdown,
    totalWords,
    startGame,
    handleKeyInput,
    resetGame,
    calculateResults,
  } = useTypingGame();

  // キーボードイベントリスナー
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState === "waiting" && event.code === "Space") {
        event.preventDefault();
        startGame();
      } else if (gameState === "playing") {
        event.preventDefault();
        handleKeyInput(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, startGame, handleKeyInput]);

  switch (gameState) {
    case "waiting":
      return <WaitingScreen onStart={startGame} />;

    case "countdown":
      return <CountdownScreen count={countdown} />;

    case "playing":
      return (
        <PlayingScreen
          currentWord={currentWord!}
          currentWordIndex={currentWordIndex}
          totalWords={totalWords}
          elapsedTime={elapsedTime}
          higgsinoWord={higgsinoWord!}
          missCount={missCount}
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
