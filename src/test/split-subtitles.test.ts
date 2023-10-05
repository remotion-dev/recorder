/// <reference path="../../node_modules/bun-types/types.d.ts" />

import { expect, test } from "bun:test";
import { ensureMaxWords } from "../../remotion/Subs/postprocess-subs";

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

const example2 = {
  text: " You can now click on a file in your public folder and preview it right in the Remotion Studio. This works with text files, videos and audio. And also you can preview the renders that you have made just by clicking on them and preview them without having to use the file explorer.",
  segments: [
    {
      id: 0,
      seek: 0,
      start: 0,
      end: 7.2,
      text: " You can now click on a file in your public folder and preview it right in the Remotion Studio.",
      tokens: [
        50363, 921, 460, 783, 3904, 319, 257, 2393, 287, 534, 1171, 9483, 290,
        12714, 340, 826, 287, 262, 3982, 9650, 11733, 13, 50747,
      ],
      temperature: 0,
      avg_logprob: -0.15417728424072266,
      compression_ratio: 1.558659217877095,
      no_speech_prob: 0.0007477715844288468,
      words: [
        {
          word: " You",
          start: 0,
          end: 0.34,
          probability: 0.9159939885139465,
        },
        {
          word: " can",
          start: 0.34,
          end: 0.48,
          probability: 0.9932722449302673,
        },
        {
          word: " now",
          start: 0.48,
          end: 0.72,
          probability: 0.9615379571914673,
        },
        {
          word: " click",
          start: 0.72,
          end: 1.04,
          probability: 0.9952284097671509,
        },
        {
          word: " on",
          start: 1.04,
          end: 1.48,
          probability: 0.9903428554534912,
        },
        {
          word: " a",
          start: 1.48,
          end: 1.74,
          probability: 0.9898533225059509,
        },
        {
          word: " file",
          start: 1.74,
          end: 2.12,
          probability: 0.9968571662902832,
        },
        {
          word: " in",
          start: 2.12,
          end: 2.38,
          probability: 0.9934490323066711,
        },
        {
          word: " your",
          start: 2.38,
          end: 2.56,
          probability: 0.9935581088066101,
        },
        {
          word: " `public`",
          start: 2.56,
          end: 2.92,
          probability: 0.8719495534896851,
        },
        {
          word: " folder",
          start: 2.92,
          end: 3.5,
          probability: 0.9967768788337708,
        },
        {
          word: " and",
          start: 3.5,
          end: 4.16,
          probability: 0.9266610145568848,
        },
        {
          word: " preview",
          start: 4.16,
          end: 4.68,
          probability: 0.997056245803833,
        },
        {
          word: " it",
          start: 4.68,
          end: 5.08,
          probability: 0.9946569204330444,
        },
        {
          word: " right",
          start: 5.08,
          end: 5.68,
          probability: 0.9760909080505371,
        },
        {
          word: " in",
          start: 5.68,
          end: 6.08,
          probability: 0.9908762574195862,
        },
        {
          word: " the",
          start: 6.08,
          end: 6.24,
          probability: 0.9888624548912048,
        },
        {
          word: " Remotion",
          start: 6.24,
          end: 6.72,
          probability: 0.7069580256938934,
        },
        {
          word: " Studio.",
          start: 6.72,
          end: 7.2,
          probability: 0.6789237856864929,
        },
      ],
    },
    {
      id: 1,
      seek: 0,
      start: 7.8,
      end: 15.4,
      text: " This works with text files, videos and audio. And also you can preview the renders that you have made",
      tokens: [
        50747, 770, 2499, 351, 2420, 3696, 11, 5861, 290, 6597, 13, 843, 635,
        345, 460, 12714, 262, 30111, 326, 345, 423, 925, 51143,
      ],
      temperature: 0,
      avg_logprob: -0.15417728424072266,
      compression_ratio: 1.558659217877095,
      no_speech_prob: 0.0007477715844288468,
      words: [
        {
          word: " This",
          start: 7.8,
          end: 7.98,
          probability: 0.9879714846611023,
        },
        {
          word: " works",
          start: 7.98,
          end: 8.28,
          probability: 0.9969307780265808,
        },
        {
          word: " with",
          start: 8.28,
          end: 8.74,
          probability: 0.9969737529754639,
        },
        {
          word: " text",
          start: 8.74,
          end: 9.12,
          probability: 0.9909679293632507,
        },
        {
          word: " files,",
          start: 9.12,
          end: 9.54,
          probability: 0.993822455406189,
        },
        {
          word: " videos",
          start: 10.16,
          end: 10.34,
          probability: 0.9949000477790833,
        },
        {
          word: " and",
          start: 10.34,
          end: 11,
          probability: 0.7407962083816528,
        },
        {
          word: " audio.",
          start: 11,
          end: 11.44,
          probability: 0.9980127811431885,
        },
        {
          word: " And",
          start: 12.26,
          end: 12.32,
          probability: 0.8380945920944214,
        },
        {
          word: " also",
          start: 12.32,
          end: 12.7,
          probability: 0.9840277433395386,
        },
        {
          word: " you",
          start: 12.7,
          end: 13.12,
          probability: 0.5584934949874878,
        },
        {
          word: " can",
          start: 13.12,
          end: 13.32,
          probability: 0.9994714856147766,
        },
        {
          word: " preview",
          start: 13.32,
          end: 13.78,
          probability: 0.9980288147926331,
        },
        {
          word: " the",
          start: 13.78,
          end: 14.22,
          probability: 0.9961846470832825,
        },
        {
          word: " renders",
          start: 14.22,
          end: 14.5,
          probability: 0.9713916778564453,
        },
        {
          word: " that",
          start: 14.5,
          end: 14.74,
          probability: 0.9710185527801514,
        },
        {
          word: " you",
          start: 14.74,
          end: 14.88,
          probability: 0.9988932013511658,
        },
        {
          word: " have",
          start: 14.88,
          end: 15.04,
          probability: 0.9796258807182312,
        },
        {
          word: " made",
          start: 15.04,
          end: 15.4,
          probability: 0.9970687031745911,
        },
      ],
    },
    {
      id: 2,
      seek: 0,
      start: 15.4,
      end: 20.22,
      text: " just by clicking on them and preview them without having to use the file explorer.",
      tokens: [
        51143, 655, 416, 12264, 319, 606, 290, 12714, 606, 1231, 1719, 284, 779,
        262, 2393, 39349, 13, 51395,
      ],
      temperature: 0,
      avg_logprob: -0.15417728424072266,
      compression_ratio: 1.558659217877095,
      no_speech_prob: 0.0007477715844288468,
      words: [
        {
          word: " just",
          start: 15.4,
          end: 15.94,
          probability: 0.8342338800430298,
        },
        {
          word: " by",
          start: 15.94,
          end: 16.16,
          probability: 0.9988896250724792,
        },
        {
          word: " clicking",
          start: 16.16,
          end: 16.46,
          probability: 0.9973172545433044,
        },
        {
          word: " on",
          start: 16.46,
          end: 16.7,
          probability: 0.9942558407783508,
        },
        {
          word: " them",
          start: 16.7,
          end: 16.94,
          probability: 0.9987725615501404,
        },
        {
          word: " and",
          start: 16.94,
          end: 17.5,
          probability: 0.9363696575164795,
        },
        {
          word: " preview",
          start: 17.5,
          end: 17.84,
          probability: 0.9992727637290955,
        },
        {
          word: " them",
          start: 17.84,
          end: 18.22,
          probability: 0.9869101643562317,
        },
        {
          word: " without",
          start: 18.22,
          end: 18.74,
          probability: 0.9774793982505798,
        },
        {
          word: " having",
          start: 18.74,
          end: 19.06,
          probability: 0.9963221549987793,
        },
        {
          word: " to",
          start: 19.06,
          end: 19.22,
          probability: 0.9943649768829346,
        },
        {
          word: " use",
          start: 19.22,
          end: 19.36,
          probability: 0.9977344274520874,
        },
        {
          word: " the",
          start: 19.36,
          end: 19.54,
          probability: 0.9975146055221558,
        },
        {
          word: " file",
          start: 19.54,
          end: 19.8,
          probability: 0.8545851707458496,
        },
        {
          word: " explorer.",
          start: 19.8,
          end: 20.22,
          probability: 0.9549255967140198,
        },
      ],
    },
  ],
  language: "English",
};

test("Should split subtitles in a smart way", () => {
  const mapped = ensureMaxWords({
    subTypes: example,
    maxCharsPerScene: 100,
  });
  const sentences = mapped.segments.map((s) =>
    s.words.map((w) => w.word).join(""),
  );
  expect(sentences).toEqual([
    " If you are on a Remotion version that has a bug, we can now notify you and give",
    " you instructions on how to update.",
  ]);
});

test("Should split subtitles in a smart way", () => {
  const mapped = ensureMaxWords({
    subTypes: example2,
    maxCharsPerScene: 100,
  });
  const sentences = mapped.segments.map((s) =>
    s.words.map((w) => w.word).join(""),
  );
  expect(sentences).toEqual([
    " You can now click on a file in your `public` folder and preview it right in the",
    " Remotion Studio. This works with text files, videos and audio. And also you can",
    " preview the renders that you have made just by clicking on them and preview them",
    " without having to use the file explorer.",
  ]);
});
