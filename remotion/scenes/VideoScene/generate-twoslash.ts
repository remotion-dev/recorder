import { StaticFile } from "@remotion/studio";
import { highlight } from "codehike/code";
import { createTwoslashFromCDN } from "twoslash-cdn";

const twoslash = createTwoslashFromCDN();

export const generateTwoslash = async (staticFile: StaticFile) => {
  const data = await (await fetch(staticFile.src)).text();

  const twoslashResult = await twoslash.run(data, "tsx", {
    compilerOptions: {
      lib: ["dom"],
    },
  });
  const highlighted = await highlight(
    { lang: "typescript", value: twoslashResult.code, meta: "" },
    "github-dark",
  );

  twoslashResult.errors.forEach(({ text, line, character, length }) => {
    highlighted.annotations.push({
      name: "callout",
      query: text,
      lineNumber: line + 1,
      data: { character },
      fromColumn: character,
      toColumn: character + length,
    });
  });

  return highlighted;
};
