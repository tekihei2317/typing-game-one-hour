import React, { useEffect, useMemo, useState } from "react";
import { Word as HiggsinoWord } from "higgsino";
import type { Word } from "../types";
import { makeKeyTypeEvent, type KeyTypeEvent } from "../lib/typing-event";

const RomajiText: React.FC<{
  typed: string;
  untyped: string;
}> = ({ typed, untyped }) => {
  return typed
    .concat(untyped)
    .split("")
    .map((char, index) => {
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

interface PlayingScreenProps {
  currentWord: Word;
  currentWordIndex: number;
  totalWords: number;
  missCount: number;
  onKeyTyped: (event: KeyTypeEvent) => void;
  onCompleted: () => void;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  currentWord,
  currentWordIndex,
  totalWords,
  missCount,
  onKeyTyped,
  onCompleted
}) => {
  const checker = useMemo(
    () => new HiggsinoWord(currentWord.displayText, currentWord.hiragana),
    [currentWord]
  );

  // これワードが変わったときに更新されないかも
  const [romanState, setRomanState] = useState<{
    typed: string;
    untyped: string;
  }>({ typed: checker.roman.typed, untyped: checker.roman.untyped });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!/^[a-z-]$/.test(e.key)) return false;

      const result = checker.typed(e.key);

      onKeyTyped(
        makeKeyTypeEvent({ pressedKey: e.key, result, timestamp: new Date() })
      );

      setRomanState({
        typed: checker.roman.typed,
        untyped: checker.roman.untyped
      });

      if (result.isFinish) {
        onCompleted();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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
            <RomajiText typed={romanState.typed} untyped={romanState.untyped} />
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
