import { useState } from "react";
import { WaitingScreen } from "./components/WaitingScreen";
import { CountdownScreen } from "./components/CountdownScreen";
import { PlayingScreen } from "./components/PlayingScreen";
import { ResultScreen } from "./components/ResultScreen";
import type { GameState } from "./types";
import { mockWords, mockPracticeResult } from "./data/mockData";

function App() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [countdown] = useState(3);

  // モック用の状態
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [elapsedTime] = useState(45);
  const [typedText, setTypedText] = useState("neko");
  const [correctLength, setCorrectLength] = useState(4);
  const [missCount, setMissCount] = useState(3);

  const currentWord = mockWords[currentWordIndex];
  const expectedRomaji = "nekononega"; // モック用のローマ字

  const handleStart = () => {
    setGameState("countdown");
    // 実際の実装ではここでカウントダウンタイマーを開始
    setTimeout(() => setGameState("playing"), 3000);
  };

  const handleRestart = () => {
    setGameState("waiting");
    setCurrentWordIndex(0);
    setTypedText("");
    setCorrectLength(0);
    setMissCount(0);
  };

  // デモ用：画面切り替えボタン
  const renderDebugButtons = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <button
        onClick={() => setGameState("waiting")}
        className="block bg-gray-600 text-white px-3 py-1 rounded text-sm"
      >
        開始画面
      </button>
      <button
        onClick={() => setGameState("countdown")}
        className="block bg-gray-600 text-white px-3 py-1 rounded text-sm"
      >
        カウントダウン
      </button>
      <button
        onClick={() => setGameState("playing")}
        className="block bg-gray-600 text-white px-3 py-1 rounded text-sm"
      >
        プレイ画面
      </button>
      <button
        onClick={() => setGameState("result")}
        className="block bg-gray-600 text-white px-3 py-1 rounded text-sm"
      >
        結果画面
      </button>
    </div>
  );

  switch (gameState) {
    case "waiting":
      return (
        <>
          <WaitingScreen onStart={handleStart} />
          {renderDebugButtons()}
        </>
      );

    case "countdown":
      return (
        <>
          <CountdownScreen count={countdown} />
          {renderDebugButtons()}
        </>
      );

    case "playing":
      return (
        <>
          <PlayingScreen
            currentWord={currentWord}
            currentWordIndex={currentWordIndex}
            totalWords={mockWords.length}
            elapsedTime={elapsedTime}
            typedText={typedText}
            expectedRomaji={expectedRomaji}
            correctLength={correctLength}
            missCount={missCount}
          />
          {renderDebugButtons()}
        </>
      );

    case "result":
      return (
        <>
          <ResultScreen result={mockPracticeResult} onRestart={handleRestart} />
          {renderDebugButtons()}
        </>
      );

    default:
      return <div>Unknown state</div>;
  }
}

export default App;
