import React from "react";
import type { PracticeResult } from "../types";

interface ResultScreenProps {
  result: PracticeResult;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRestart,
}) => {
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "素晴らしい！";
    if (score >= 70) return "よくできました！";
    if (score >= 50) return "もう少し！";
    return "練習あるのみ！";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">結果発表</h1>
          <p className="text-xl text-gray-700">お疲れさまでした！</p>
        </div>

        {/* 総合スコア */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            総合スコア
          </h2>
          <div
            className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}
          >
            {result.score}点
          </div>
          <p className="text-xl text-gray-600">
            {getScoreMessage(result.score)}
          </p>
        </div>

        {/* 詳細結果 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            詳細結果
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatTime(result.inputTime)}
              </div>
              <p className="text-gray-600">入力時間</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {result.inputCharacterCount}
              </div>
              <p className="text-gray-600">入力文字数</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">
                {result.missCount}
              </div>
              <p className="text-gray-600">ミス数</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {result.accuracy.toFixed(1)}%
              </div>
              <p className="text-gray-600">正確率</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-2">
                {result.kpm}
              </div>
              <p className="text-gray-600">KPM（1分間あたりの入力数）</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-2">
                {result.rkpm}
              </div>
              <p className="text-gray-600">RKPM（初速を除いた入力数）</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {result.initialSpeed.toFixed(2)}秒
              </div>
              <p className="text-gray-600">初速（平均反応時間）</p>
            </div>
          </div>
        </div>

        {/* ワード別結果 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            ワード別結果
          </h2>

          <div className="space-y-4">
            {result.wordResults.map((wordResult, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {wordResult.word.displayText}
                    </p>
                    <p className="text-sm text-gray-600">
                      {wordResult.word.hiragana}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex space-x-4">
                      <span>KPM: {wordResult.kpm}</span>
                      <span>初速: {wordResult.initialSpeed.toFixed(1)}s</span>
                      <span
                        className={
                          wordResult.missCount > 0
                            ? "text-red-500"
                            : "text-green-600"
                        }
                      >
                        ミス: {wordResult.missCount}
                      </span>
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
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg"
          >
            もう一度プレイ
          </button>
        </div>
      </div>
    </div>
  );
};
