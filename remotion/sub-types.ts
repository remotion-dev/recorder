interface WhisperWord {
  offsets: {
    from: number;
    to: number;
  };
  text: string;
}

export interface WhisperOutput {
  transcription: WhisperWord[];
  result: {
    language: string;
  };
}

export interface SubTypes {
  segments: Segment[];
}

export interface Segment {
  words: Word[];
}

export interface Word {
  word: string;
  start: number;
  end: number;
  monospace?: boolean;
}

export const whisperWordToWord = (word: WhisperWord): Word => {
  return {
    word: word.text,
    start: word.offsets.from,
    end: word.offsets.to,
  };
};
