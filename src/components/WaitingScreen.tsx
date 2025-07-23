import React, { useEffect } from "react";

type WaitingScreenProps = {
  onStart: () => void;
};

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ onStart }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // スペースキーでスタート
      if (event.key === " ") {
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-16">
          日本語タイピングゲーム
        </h1>

        <div className="mb-8">
          <div className="border-2 border-gray-900 px-6 py-3 font-mono text-2xl text-gray-900 inline-block">
            Space
          </div>
          <p className="text-xl text-gray-900 mt-4">キーを押してスタート</p>
        </div>
      </div>
    </div>
  );
};
