import React from "react";
import type { Word } from "../types";
import type { Word as HiggsinoWord } from "higgsino";

interface PlayingScreenProps {
  currentWord: Word;
  currentWordIndex: number;
  totalWords: number;
  higgsinoWord: HiggsinoWord;
  missCount: number;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  currentWord,
  currentWordIndex,
  totalWords,
  higgsinoWord,
  missCount
}) => {

  const renderRomajiText = () => {
    const typed = higgsinoWord.roman.typed;
    const untyped = higgsinoWord.roman.untyped;
    const all = higgsinoWord.roman.all;

    return all.split("").map((char, index) => {
      let className = "text-3xl ";

      if (index < typed.length) {
        // 入力済み（正解）
        className += "text-gray-900 font-bold";
      } else if (index === typed.length && untyped.length > 0) {
        // 次に入力すべき文字
        className += "text-gray-400 underline";
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
            <span>
              {currentWordIndex + 1} / {totalWords}
            </span>
            <span>ミス: {missCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
