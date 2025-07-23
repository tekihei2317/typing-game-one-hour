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
  initialSpeed: number;
  kpm: number;
  rkpm: number;
  missCount: number;
};
