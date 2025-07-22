/**
 * ワード
 */
export type Word = {
  displayText: string; // 表示する文字列（漢字混じり文）
  hiragana: string; // 入力するひらがな
};

/**
 * タイピング練習記録
 */
export type PracticeResult = {
  score: number; // スコア
  inputTime: number; // 入力時間（秒）
  inputCharacterCount: number; // 入力文字数（ローマ字の文字数）
  missCount: number; // ミス入力数（ミスタイプの回数）
  accuracy: number; // 正確率（正しく入力した文字数の割合）
  kpm: number; // 60秒間に入力した文字の数（keys per minutes）
  rkpm: number; // 初速を抜いたKPM
  initialSpeed: number; // ワードが表示されてから最初の正解の文字を入力するまでにかかった時間（平均値）
  wordResults: WordResult[]; // ワード別の結果
};

/**
 * 各ワードの練習記録
 */
export type WordResult = {
  word: Word;
  initialSpeed: number; // 同上
  kpm: number; // 同上
  rkpm: number; // 同上
  missCount: number; // 同上
};

/**
 * ワード別のタイピング詳細情報
 */
export interface WordTypingInfo {
  word: Word;
  startTime: number; // ワードを表示した時間
  firstInputTime: number; // B. 最初の文字を正解した時間
  completionTime: number; // C. 最後の文字を正解した時間
  missCount: number; // D. ミス数
  inputKeys: string; // E. 入力したローマ字列
}

/**
 * ゲーム状態
 */
export type GameState =
  | "waiting"
  | "countdown"
  | "playing"
  | "interval"
  | "result";

/**
 * ゲーム全体の状態管理
 */
export type GameContext = {
  state: GameState;
  currentWordIndex: number;
  words: Word[];
  startTime: number | null;
  endTime: number | null;
  inputHistory: string[]; // 入力履歴
  missHistory: boolean[]; // ミス履歴（各文字でミスがあったかどうか）
  wordStartTimes: number[]; // 各ワードの開始時刻
};
