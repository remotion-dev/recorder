import { expect, test } from "bun:test";
import { ensureMaxWords } from "../../remotion/Subs/postprocess-subs";

test("Should split subtitles in a smart way", () => {
  const example = {
    text: " If you are on a remotion version that has a bug, we can now notify you and give you instructions on how to update.",
    segments: [
      {
        id: 0,
        seek: 0,
        start: 0,
        end: 8.3,
        text: " If you are on a remotion version that has a bug, we can now notify you and give you instructions on how to update.",
        tokens: [
          50363, 1002, 345, 389, 319, 257, 816, 9650, 2196, 326, 468, 257, 5434,
          11, 356, 460, 783, 19361, 345, 290, 1577, 345, 7729, 319, 703, 284,
          4296, 13, 50795,
        ],
        temperature: 0,
        avg_logprob: -0.20237412452697753,
        compression_ratio: 1.2258064516129032,
        no_speech_prob: 0.0004261475696694106,
        words: [
          {
            word: " If",
            start: 0,
            end: 0.36,
            probability: 0.931988537311554,
          },
          {
            word: " you",
            start: 0.36,
            end: 0.5,
            probability: 0.9904285669326782,
          },
          {
            word: " are",
            start: 0.5,
            end: 0.7,
            probability: 0.9484681487083435,
          },
          {
            word: " on",
            start: 0.7,
            end: 0.9,
            probability: 0.9884634613990784,
          },
          {
            word: " a",
            start: 0.9,
            end: 1.06,
            probability: 0.9936116337776184,
          },
          {
            word: " Remotion",
            start: 1.06,
            end: 1.58,
            probability: 0.6116318851709366,
          },
          {
            word: " version",
            start: 1.58,
            end: 2,
            probability: 0.9858754277229309,
          },
          {
            word: " that",
            start: 2,
            end: 2.26,
            probability: 0.9840766787528992,
          },
          {
            word: " has",
            start: 2.26,
            end: 2.54,
            probability: 0.9976162910461426,
          },
          {
            word: " a",
            start: 2.54,
            end: 2.8,
            probability: 0.9968041181564331,
          },
          {
            word: " bug,",
            start: 2.8,
            end: 3.22,
            probability: 0.9963636994361877,
          },
          {
            word: " we",
            start: 4.02,
            end: 4.22,
            probability: 0.9911231994628906,
          },
          {
            word: " can",
            start: 4.22,
            end: 4.38,
            probability: 0.99368816614151,
          },
          {
            word: " now",
            start: 4.38,
            end: 4.76,
            probability: 0.9742084741592407,
          },
          {
            word: " notify",
            start: 4.76,
            end: 5.44,
            probability: 0.9970552921295166,
          },
          {
            word: " you",
            start: 5.44,
            end: 5.78,
            probability: 0.9907938838005066,
          },
          {
            word: " and",
            start: 5.78,
            end: 6.04,
            probability: 0.9871250987052917,
          },
          {
            word: " give",
            start: 6.04,
            end: 6.22,
            probability: 0.9949737787246704,
          },
          {
            word: " you",
            start: 6.22,
            end: 6.42,
            probability: 0.9959251880645752,
          },
          {
            word: " instructions",
            start: 6.42,
            end: 6.86,
            probability: 0.9962448477745056,
          },
          {
            word: " on",
            start: 6.86,
            end: 7.38,
            probability: 0.9943970441818237,
          },
          {
            word: " how",
            start: 7.38,
            end: 7.64,
            probability: 0.9969863295555115,
          },
          {
            word: " to",
            start: 7.64,
            end: 7.88,
            probability: 0.9990474581718445,
          },
          {
            word: " update.",
            start: 7.88,
            end: 8.3,
            probability: 0.9983711838722229,
          },
        ],
      },
    ],
    language: "English",
  };

  const mapped = ensureMaxWords({
    subTypes: example,
    maxCharsPerScene: 100,
  });
  const sentences = mapped.segments.map((s) =>
    s.words.map((w) => w.word).join(""),
  );
  expect(sentences).toEqual([
    " If you are on a Remotion version that has a bug,",
    " we can now notify you and give you instructions on how to update.",
  ]);
});
