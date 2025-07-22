import React from "react";
import type { PracticeResult } from "../types";

interface ResultScreenProps {
  result: PracticeResult;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRestart
}) => {
  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(1)}秒`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">結果</h1>
        </div>

        {/* 詳細結果 */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {formatTime(result.inputTime)}
              </div>
              <p className="text-gray-900">時間</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.inputCharacterCount}
              </div>
              <p className="text-gray-900">文字数</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.missCount}
              </div>
              <p className="text-gray-900">ミス数</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.accuracy.toFixed(1)}%
              </div>
              <p className="text-gray-900">正確率</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.kpm}
              </div>
              <p className="text-gray-900">KPM</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.initialSpeed.toFixed(3)}秒
              </div>
              <p className="text-gray-900">初速</p>
            </div>
          </div>
        </div>

        {/* ワード別結果 */}
        <div className="mb-12">
          <div className="space-y-4">
            {result.wordResults.map((wordResult, index) => (
              <div key={index} className="border-l-4 border-gray-900 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {wordResult.word?.displayText || "エラー"}
                    </p>
                    <p className="text-gray-900">
                      {wordResult.word?.hiragana || ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex space-x-4 text-gray-900">
                      <span>KPM: {wordResult.kpm}</span>
                      <span>初速: {wordResult.initialSpeed.toFixed(3)}s</span>
                      <span>ミス: {wordResult.missCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="border-2 border-gray-900 text-gray-900 font-bold py-4 px-8 text-xl hover:bg-gray-900 hover:text-gray-50 transition-colors"
          >
            もう一度プレイ
          </button>
        </div>
      </div>
    </div>
  );
};
