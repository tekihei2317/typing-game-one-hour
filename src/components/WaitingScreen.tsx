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
};

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  onStart,
  topics,
  selectedTopic,
  onTopicSelected
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

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            お題を選択してください
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <button
                key={topic.key}
                onClick={() => onTopicSelected(topic.key)}
                className={`p-4 border-2 border-gray-900 text-gray-900 font-mono transition-all duration-200 text-center cursor-pointer ${
                  selectedTopic === topic.key
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100 active:bg-gray-300"
                }`}
              >
                <div className="text-lg font-bold mb-1">{topic.name}</div>
                <div className="text-sm">{topic.wordCount}語</div>
              </button>
            ))}
          </div>
        </div>

        {selectedTopic && (
          <div className="text-center">
            <div className="border-2 border-gray-900 px-6 py-3 font-mono text-2xl text-gray-900 inline-block mb-4">
              Space
            </div>
            <p className="text-xl text-gray-900">キーを押してスタート</p>
          </div>
        )}
      </div>
    </GameLayout>
  );
};
