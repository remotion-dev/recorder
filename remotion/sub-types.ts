export interface SubTypes {
  text: string;
  segments: Segment[];
  language: string;
}

export interface Segment {
  id: number;
  start: number;
  end: number;
  words: Word[];
}

export interface Word {
  word: string;
  start: number;
  end: number;
  monospace?: boolean;
}
