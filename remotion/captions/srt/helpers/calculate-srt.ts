import { Word } from "../../../../config/autocorrect";
import { FPS } from "../../../../config/fps";
import { joinBackticks } from "../../processing/join-backticks";
import { postprocessCaptions } from "../../processing/postprocess-subs";
import { WhisperCppOutput } from "../../types";
import { UnserializedSrt } from "./serialize-srt";

// The SRT standard recommends not more than 42 characters per line

const MAX_CHARS_PER_LINE = 42;

const segmentWords = (word: Word[]) => {
  const segments: Word[][] = [];
  let currentSegment: Word[] = [];

  for (let i = 0; i < word.length; i++) {
    const w = word[i] as Word;
    const remainingWords = word.slice(i + 1);
    const filledCharactersInLine = currentSegment
      .map((s) => s.text.length)
      .reduce((a, b) => a + b, 0);

    const preventOrphanWord =
      remainingWords.length < 4 &&
      remainingWords.length > 1 &&
      filledCharactersInLine > MAX_CHARS_PER_LINE / 2;

    if (
      filledCharactersInLine + w.text.length > MAX_CHARS_PER_LINE ||
      preventOrphanWord
    ) {
      segments.push(currentSegment);
      currentSegment = [];
    }
    currentSegment.push(w);
  }

  segments.push(currentSegment);
  return segments;
};

export const calculateSrt = ({
  startFrame,
  whisperCppOutput,
}: {
  whisperCppOutput: WhisperCppOutput;
  startFrame: number;
}) => {
  const postprocessed = joinBackticks(postprocessCaptions(whisperCppOutput));
  const segments = segmentWords(postprocessed);

  const srtSegments: UnserializedSrt[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) {
      throw new Error(`Segment with index ${i} is undefined`);
    }

    const firstSegment = segment[0];
    const lastSegment = segment[segment.length - 1];

    if (!firstSegment) {
      throw new Error("lastSegment is undefined");
    }
    if (!lastSegment) {
      throw new Error("lastSegment is undefined");
    }

    const offset = -(startFrame / FPS) * 1000;

    const firstTimestamp = Math.round(firstSegment.firstTimestamp + offset);
    if (lastSegment.lastTimestamp === null) {
      throw new Error("Cannot serialize .srt file: lastTimestamp is null");
    }

    const lastTimestamp = lastSegment.lastTimestamp + offset;

    const unserialized: UnserializedSrt = {
      firstTimestamp,
      lastTimestamp,
      text: segment
        .map((s) => s.text.trim())
        .join(" ")
        .trim(),
      words: segment,
    };
    srtSegments.push(unserialized);
  }

  return srtSegments;
};
