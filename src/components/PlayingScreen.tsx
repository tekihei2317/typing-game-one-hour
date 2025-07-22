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
  typedText,
  expectedRomaji,
  correctLength,
  missCount,
}) => {
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const renderRomajiText = () => {
    return expectedRomaji.split("").map((char, index) => {
      let className = "text-2xl ";

      if (index < correctLength) {
        // 入力済み（正解）
        className += "text-green-600 bg-green-100";
      } else if (index === correctLength) {
        // 次に入力すべき文字
        className += "text-blue-600 bg-blue-100 font-bold";
      } else {
        // 未入力
        className += "text-gray-400";
      }

      return (
        <span key={index} className={`${className} px-1 py-1 rounded`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      {/* ヘッダー情報 */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-6">
              <span>時間: {formatTime(Math.floor(elapsedTime))}</span>
              <span>ミス: {missCount}回</span>
              <span>
                進捗: {currentWordIndex + 1} / {totalWords}
              </span>
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentWordIndex + 1) / totalWords) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* 問題文（漢字混じり） */}
          <div className="text-center mb-8">
            <h2 className="text-sm text-gray-500 mb-2">問題文</h2>
            <p className="text-4xl font-bold text-gray-800 mb-4">
              {currentWord.displayText}
            </p>
          </div>

          {/* ひらがな */}
          <div className="text-center mb-8">
            <h3 className="text-sm text-gray-500 mb-2">ひらがな</h3>
            <p className="text-2xl text-gray-600">{currentWord.hiragana}</p>
          </div>

          {/* ローマ字入力表示 */}
          <div className="text-center mb-6">
            <h3 className="text-sm text-gray-500 mb-4">ローマ字入力</h3>
            <div className="font-mono text-center bg-gray-50 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
              {renderRomajiText()}
            </div>
          </div>

          {/* 入力情報 */}
          <div className="text-center text-sm text-gray-500">
            <p>
              現在の入力: <span className="font-mono">{typedText}</span>
            </p>
          </div>
        </div>

        {/* 操作説明 */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            キーボードで入力してください • 複数の入力方法に対応しています
          </p>
        </div>
      </div>
    </div>
  );
};
