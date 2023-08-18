export interface SubTypes {
  text: string;
  segments: Segment[];
  language: string;
}

export interface Segment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
  words: Word[];
}

export interface Word {
  word: string;
  start: number;
  end: number;
  probability: number;
}
