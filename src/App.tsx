import { useState } from "react";
import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { IntervalScreen } from "./components/IntervalScreen";
import { ResultScreen } from "./components/ResultScreen";
import { useTypingGame } from "./hooks/use-typing-game";

import { selectRandomWords } from "./data/words";
import { words as bodyWords } from "./data/body";
import { words as earlySummerWords } from "./data/early-summer";
import { words as fishWords } from "./data/fish";
import { words as motivationalWords } from "./data/motivational";
import { words as numberWords } from "./data/number";
import { words as onomatopoeiaWords } from "./data/onomatopoeia";
import { words as summerWords } from "./data/summer";
import type { Word } from "./types";

const topics = [
  { key: "body", name: "体の慣用句", word: bodyWords },
  { key: "earlySummer", name: "初夏の言葉", word: earlySummerWords },
  { key: "fish", name: "魚のことわざ", word: fishWords },
  { key: "motivational", name: "元気が出る言葉", word: motivationalWords },
  { key: "number", name: "数の言葉", word: numberWords },
  { key: "onomatopoeia", name: "擬音・擬態語", word: onomatopoeiaWords },
  { key: "summer", name: "夏の言葉", word: summerWords }
];

/** 問題数 */
const problemCount = 10;

function App() {
  const [selectedTopic, setSelectedTopic] = useState<string>("body");
  const currentWords: Word[] =
    topics.find((topic) => topic.key === selectedTopic)?.word ?? ([] as Word[]);

  const {
    state,
    startGame,
    tickCountDown,
    recordKeyType,
    completeWord,
    startNextWord,
    resetGame
  } = useTypingGame(selectRandomWords(currentWords, problemCount));

  console.log({ selectedTopic, firstWord: currentWords[0] });

  const handleRestart = () => {
    resetGame();
  };

  switch (state.gameState) {
    case "waiting":
      return (
        <WaitingScreen
          onStart={startGame}
          selectedTopic={selectedTopic}
          onTopicSelected={setSelectedTopic}
          topics={topics.map((topic) => ({
            ...topic,
            wordCount: topic.word.length
          }))}
        />
      );

    case "countdown":
      return <CountdownScreen count={state.count} onTick={tickCountDown} />;

    case "playing":
      return (
        <PlayingScreen
          currentWord={state.currentWord}
          currentWordIndex={state.currentWordIndex}
          totalWords={problemCount}
          missCount={state.totalMissCount}
          onKeyTyped={recordKeyType}
          onCompleted={completeWord}
        />
      );

    case "interval":
      return (
        <IntervalScreen
          totalWords={problemCount}
          currentWordIndex={state.currentWordIndex}
          missCount={state.totalMissCount}
          startNextWord={startNextWord}
        />
      );

    case "result":
      return <ResultScreen result={state.result} onRestart={handleRestart} />;

    default:
      return <div>Unknown state</div>;
  }
}

export default App;
