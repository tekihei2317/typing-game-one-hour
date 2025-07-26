const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

async function parseEtypingWords() {
  try {
    // XMLファイルを読み込み
    const xmlPath = path.join(__dirname, "../words/1266_夏の言葉.xml");
    const xmlData = fs.readFileSync(xmlPath, "utf8");

    // xml2jsでパース
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    // Word配列に変換
    const words = result.Words.Part[0].Word.map((word) => ({
      displayText: word.Display[0],
      hiragana: word.Characters[0]
    }));

    console.log(`Parsed ${words.length} words from e-typing data`);

    // TypeScriptファイルとして出力
    const outputContent = `import type { Word } from "../types";

/**
 * e-typing 夏の言葉
 */
export const etypingSummerWords: Word[] = ${JSON.stringify(words, null, 2)};
`;

    const outputPath = path.join(__dirname, "../src/data/夏の言葉.ts");
    fs.writeFileSync(outputPath, outputContent, "utf8");

    console.log(`✅ Successfully generated: ${outputPath}`);
    console.log(`📊 Total words: ${words.length}`);

    // サンプルを表示
    console.log("\n📝 Sample words:");
    words.slice(0, 3).forEach((word, index) => {
      console.log(`${index + 1}. "${word.displayText}" -> "${word.hiragana}"`);
    });
  } catch (error) {
    console.error("❌ Error parsing e-typing words:", error);
    process.exit(1);
  }
}

parseEtypingWords();
