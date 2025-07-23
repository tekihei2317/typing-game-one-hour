import React, { useEffect } from "react";
import { GameLayout } from "./GameLayout";

interface IntervalScreenProps {
  totalWords: number;
  currentWordIndex: number;
  missCount: number;
  startNextWord: (timestamp: Date) => void;
}

export const IntervalScreen: React.FC<IntervalScreenProps> = ({
  totalWords,
  currentWordIndex,
  missCount,
  startNextWord
}) => {
  // インターバルを終了する
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startNextWord(new Date());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [startNextWord]);

  return (
    <GameLayout className="p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* 進捗とステータス */}
        <div className="text-center text-gray-900 mb-8">
          <div className="flex justify-center space-x-8 text-lg">
            <span>
              {currentWordIndex + 1} / {totalWords}
            </span>
            <span>ミス: {missCount}</span>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};
