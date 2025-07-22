import React from "react";

interface CountdownScreenProps {
  count: number;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ count }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-900">
          {count}
        </div>
      </div>
    </div>
  );
};
