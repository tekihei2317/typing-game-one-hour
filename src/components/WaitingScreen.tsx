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
                className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedTopic === topic.key
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-md"
                }`}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {topic.name}
                </h3>
                <p className="text-sm text-gray-600">{topic.wordCount}語</p>
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
