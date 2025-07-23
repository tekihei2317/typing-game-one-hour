import React, { useEffect } from "react";
import { GameLayout } from "./GameLayout";

interface CountdownScreenProps {
  onTick: (timestamp: Date) => void;
  count: number;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  count,
  onTick
}) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      onTick(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onTick]);

  return (
    <GameLayout className="flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-900">{count}</div>
      </div>
    </GameLayout>
  );
};
