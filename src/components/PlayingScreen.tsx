import React from "react";
import type { Word } from "../types";

interface PlayingScreenProps {
  currentWord: Word;
  currentWordIndex: number;
  totalWords: number;
  elapsedTime: number;
  typedText: string;
  expectedRomaji: string;
  correctLength: number;
  missCount: number;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  currentWord,
  currentWordIndex,
  totalWords,
  elapsedTime,
  expectedRomaji,
  correctLength,
  missCount,
}) => {
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const renderRomajiText = () => {
    return expectedRomaji.split("").map((char, index) => {
      let className = "text-3xl ";

      if (index < correctLength) {
        // 入力済み（正解）
        className += "text-gray-900 font-bold";
      } else if (index === correctLength) {
        // 次に入力すべき文字
        className += "text-gray-900 font-bold underline";
      } else {
        // 未入力
        className += "text-gray-400";
      }

      return (
        <span key={index} className={`${className} px-1`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-16">
        {/* 問題文（漢字混じり） */}
        <div className="text-center mb-12">
          <p className="text-5xl font-bold text-gray-900 mb-8">
            {currentWord.displayText}
          </p>
        </div>

        {/* ひらがな */}
        <div className="text-center mb-12">
          <p className="text-3xl text-gray-900">{currentWord.hiragana}</p>
        </div>

        {/* ローマ字入力表示 */}
        <div className="text-center mb-12">
          <div className="font-mono text-center p-4 min-h-[80px] flex items-center justify-center">
            {renderRomajiText()}
          </div>
        </div>

        {/* 進捗とステータス */}
        <div className="text-center text-gray-900">
          <div className="flex justify-center space-x-8 text-lg">
            <span>{currentWordIndex + 1} / {totalWords}</span>
            <span>{formatTime(Math.floor(elapsedTime))}</span>
            <span>ミス: {missCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
