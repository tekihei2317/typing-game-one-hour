import React from "react";

interface WaitingScreenProps {
  onStart: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-indigo-800 mb-8">
          日本語タイピングゲーム
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            ゲーム説明
          </h2>

          <div className="text-left space-y-4 text-gray-700">
            <p className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-semibold mr-3">
                1
              </span>
              表示される日本語をローマ字で入力してください
            </p>
            <p className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-semibold mr-3">
                2
              </span>
              複数の入力方法に対応しています（例：「つ」→「tu」「tsu」）
            </p>
            <p className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-semibold mr-3">
                3
              </span>
              全ての文章を入力し終えると結果が表示されます
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-gray-200 border border-gray-300 rounded px-4 py-2 font-mono text-gray-700 shadow-sm">
              Space
            </div>
            <span className="text-gray-600">キーを押してスタート</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg"
        >
          ゲーム開始
        </button>

        <p className="text-gray-600 mt-4">
          キーボードのスペースキーでも開始できます
        </p>
      </div>
    </div>
  );
};
