import type { Word } from "../../../config/autocorrect";
import { autocorrectWords } from "../../../config/autocorrect";
import { type WhisperCppOutput } from "../types";
import { removeBlankTokens } from "./remove-blank-tokens";
import { whisperWordToWord } from "./whisper-word-to-word";
import { wordsTogether } from "./words-together";

const FILLER_WORDS = ["[PAUSE]", "[BLANK_AUDIO]", "[Silence]", "[INAUDIBLE]"];

const removeWhisperBlankWords = (original: Word[]): Word[] => {
  let firstIdx = 0;
  let concatentatedWord = "";
  let inBlank = false;

  const words = [...original];
  words.forEach((word, index) => {
    const wordCopy = { ...word };
    wordCopy.text = wordCopy.text.trim();
    if (wordCopy.text.includes("[")) {
      inBlank = true;
      firstIdx = index;
    }

    if (inBlank && FILLER_WORDS.find((w) => w.includes(wordCopy.text))) {
      concatentatedWord += wordCopy.text;
    }

    if (inBlank && wordCopy.text.includes("]")) {
      concatentatedWord += wordCopy.text;
      if (FILLER_WORDS.find((w) => concatentatedWord.includes(w))) {
        for (let i = firstIdx; i <= index; i++) {
          const currentWord = words[i];
          if (currentWord?.text !== undefined) {
            words[i] = {
              ...currentWord,
              text: "",
            };
          }
        }
      }
    }
  });
  return words;
};

export const postprocessCaptions = ({
  subTypes,
}: {
  subTypes: WhisperCppOutput;
}): Word[] => {
  const blankTokensRemoved = removeBlankTokens(subTypes.transcription);
  const words = blankTokensRemoved.map((w, i) => {
    return whisperWordToWord(w, blankTokensRemoved[i + 1] ?? null);
  });

  const removeBlankAudioAndPause = removeWhisperBlankWords(words);
  const removeBlankTokensAgain = removeBlankAudioAndPause.filter(
    (w) => w.text.trim() !== "",
  );

  const correctedWords = autocorrectWords(removeBlankTokensAgain);

  const movedBackTickToWord = correctedWords.map((word) => {
    return {
      ...word,
      text: word.text.replaceAll(/`\s/g, " `"),
    };
  });

  const allWords = wordsTogether(movedBackTickToWord);

  return allWords;
};
