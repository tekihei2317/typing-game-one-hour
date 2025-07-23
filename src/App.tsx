import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { IntervalScreen } from "./components/IntervalScreen";
import { ResultScreen } from "./components/ResultScreen";
import { useTypingGame } from "./hooks/use-typing-game";
import { practiceWords, selectRandomWords } from "./data/words";

const words = selectRandomWords(practiceWords, 2);

function App() {
  const {
    state,
    startGame,
    tickCountDown,
    recordKeyType,
    completeWord,
    startNextWord,
    resetGame
  } = useTypingGame(words);

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
          totalWords={words.length}
          missCount={state.totalMissCount}
          onKeyTyped={recordKeyType}
          onCompleted={completeWord}
        />
      );

    case "interval":
      return (
        <IntervalScreen
          totalWords={words.length}
          currentWordIndex={state.currentWordIndex}
          missCount={state.totalMissCount}
          startNextWord={startNextWord}
        />
      );

    case "result":
      return <ResultScreen result={state.result} onRestart={resetGame} />;

    default:
      return <div>Unknown state</div>;
  }
}

export default App;
