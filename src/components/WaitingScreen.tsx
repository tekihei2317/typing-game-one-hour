import React, { useEffect } from "react";
import { GameLayout } from "./GameLayout";

type TopicInfo = {
  key: string;
  name: string;
  wordCount: number;
};

type WaitingScreenProps = {
  onStart: () => void;
  selectedTopic: string;
  onTopicSelected: (topic: string) => void;
  topics: TopicInfo[];
  problemCount: number;
  onProblemCountSelected: (count: number) => void;
};

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  onStart,
  topics,
  selectedTopic,
  onTopicSelected,
  problemCount,
  onProblemCountSelected
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // スペースキーでスタート
      if (event.key === " ") {
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart, selectedTopic]);

  return (
    <GameLayout className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">
          日本語タイピングゲーム
        </h1>

        <div className="mb-8 flex justify-center items-center gap-8">
          <div className="flex gap-4">
            <select
              value={selectedTopic}
              onChange={(e) => onTopicSelected(e.target.value)}
              className="px-4 py-2 border-2 border-gray-900 bg-white text-gray-900 font-mono text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              {topics.map((topic) => (
                <option key={topic.key} value={topic.key}>
                  {topic.name} ({topic.wordCount}語)
                </option>
              ))}
            </select>

            <div className="flex gap-1">
              {[5, 10, 15, 30, 100].map((count) => (
                <button
                  key={count}
                  onClick={() => onProblemCountSelected(count)}
                  className={`w-12 py-2 rounded-lg font-mono text-lg transition-all duration-200 ${
                    problemCount === count
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedTopic && (
          <div className="text-center">
            <p className="text-xl text-gray-900">Spaceキーを押してスタート</p>
          </div>
        )}
      </div>
    </GameLayout>
  );
};
