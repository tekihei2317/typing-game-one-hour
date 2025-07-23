import { useEffect } from "react";
import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { useTypingGame } from "./hooks/use-typing-game";

type IntervalScreenProps = {
  startNextWord: (timestamp: Date) => void;
};

const IntervalScreen: React.FC<IntervalScreenProps> = ({ startNextWord }) => {
  // インターバルを終了する
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startNextWord(new Date());
    }, 500);

    return () => clearTimeout(timeoutId);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl text-gray-900">次のワードへ...</div>
      </div>
    </div>
  );
};

function App() {
  const {
    state,
    startGame,
    tickCountDown,
    recordKeyType,
    completeWord,
    startNextWord,
    resetGame
  } = useTypingGame();

  switch (state.gameState) {
    case "waiting":
      return <WaitingScreen onStart={startGame} />;

    case "countdown":
      return <CountdownScreen count={state.count} onTick={tickCountDown} />;

    case "playing":
      return (
        <PlayingScreen
          currentWord={state.currentWord}
          currentWordIndex={state.currentWordIndex}
          totalWords={0}
          missCount={0}
          onKeyTyped={recordKeyType}
          onCompleted={completeWord}
        />
      );

    case "interval":
      return <IntervalScreen startNextWord={startNextWord} />;

    case "result":
      return <ResultScreen result={state.result} onRestart={resetGame} />;

    default:
      return <div>Unknown state</div>;
  }
}

export default App;
