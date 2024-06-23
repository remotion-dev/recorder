import { UnserializedSrt } from "./serialize-srt";

export type SrtsToCombine = {
  offsetInMs: number;
  srts: UnserializedSrt[];
};

export const combineSrt = (srt: SrtsToCombine[]): UnserializedSrt[] => {
  return srt
    .map((line) => {
      return line.srts.map((s): UnserializedSrt => {
        return {
          text: s.text,
          firstTimestamp: s.firstTimestamp + line.offsetInMs,
          lastTimestamp: s.lastTimestamp + line.offsetInMs,
          words: s.words,
        };
      });
    })
    .flat(1);
};
