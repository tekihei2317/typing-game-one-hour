import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          日本語タイピングゲーム
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Tailwind CSS test - スタイルが適用されていることを確認
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
