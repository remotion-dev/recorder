import type { Word } from "../../config/autocorrect";

export type Token = {
  t_dtw: number;
  offsets: {
    from: number;
    to: number;
  };
  text: string;
  p: number;
};

export type WhisperWord = {
  tokens: Token[];
  text: string;
};

export type WhisperCppOutput = {
  transcription: WhisperWord[];
  result: {
    language: string;
  };
};

export type CaptionPage = {
  words: Word[];
};

export type LayoutedCaptions = {
  segments: CaptionPage[];
};
