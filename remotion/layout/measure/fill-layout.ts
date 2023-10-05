import { measureWordWidth } from "./measure-word";

type Word = {
  text: string;
  fontFamily: string;
  fontWeight: string | number;
};

export const fillTextBox = ({
  maxBoxWidth,
  maxLines,
}: {
  maxBoxWidth: number;
  maxLines: number;
}) => {
  const lines: Word[][] = new Array(maxLines).fill([] as string[]);

  return {
    add: ({
      text,
      fontFamily,
      fontWeight,
    }: {
      text: string;
      fontFamily: string;
      fontWeight: string | number;
    }): {
      exceedsBox: boolean;
      newLine: boolean;
    } => {
      const lastLineIndex = lines.findLastIndex((l) => l.length > 0);
      const currentlyAt = lastLineIndex === -1 ? 0 : lastLineIndex + 1;
      const lineToUse = lines[currentlyAt];

      const lineWithWord: Word[] = [
        ...lineToUse,
        { text, fontFamily, fontWeight },
      ];

      const widths = lineWithWord.map((w) => measureWordWidth(w));
      const lineWidthWithWordAdded = widths.reduce((a, b) => a + b, 0);

      if (lineWidthWithWordAdded <= maxBoxWidth) {
        return { exceedsBox: false, newLine: false };
      }

      if (currentlyAt === maxLines - 1) {
        return { exceedsBox: true, newLine: false };
      }

      lines[currentlyAt + 1] = [{ text, fontFamily, fontWeight }];
      return { exceedsBox: false, newLine: true };
    },
  };
};
