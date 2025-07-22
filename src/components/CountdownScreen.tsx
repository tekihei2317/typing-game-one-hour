import React from "react";

interface CountdownScreenProps {
  count: number;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ count }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            ゲーム開始まで
          </h2>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center animate-pulse">
            <div className="text-8xl font-bold text-orange-500">{count}</div>
          </div>
        </div>

        <p className="text-xl text-gray-600 mt-8">準備はいいですか？</p>
      </div>
    </div>
  );
};
