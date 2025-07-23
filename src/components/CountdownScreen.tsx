import React, { useEffect } from "react";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-900">{count}</div>
      </div>
    </div>
  );
};
