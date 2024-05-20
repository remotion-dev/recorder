import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const out = await bundle({
  entryPoint: "./remotion/index.ts",
});
console.log(out);

const composition = await selectComposition({
  id: "lasvegas",
  serveUrl: out,
});

for (let i = 0; i < 1000; i++) {
  await renderMedia({
    composition,
    codec: "h264",
    serveUrl: out,
    frameRange: [0, 100],
    logLevel: "verbose",
    outputLocation: "hithere.mp4",
    onProgress: ({ renderedFrames, encodedFrames, progress }) => {
      console.log(renderedFrames, encodedFrames, progress);
    },
  });
}
