import {
  fontFamily as regularFont,
  loadFont as loadRegular,
} from "@remotion/google-fonts/Inter";

import {
  fontFamily as monospaceFont,
  loadFont as loadMonospace,
} from "@remotion/google-fonts/RobotoCondensed";

const regular = loadRegular();
const monospace = loadMonospace();

export const waitForFonts = async () => {
  await regular.waitUntilDone();
  await monospace.waitUntilDone();
};

export const REGULAR_FONT_FAMILY = regularFont;
export const REGULAR_FONT_WEIGHT = 600;

export const MONOSPACE_FONT_FAMILY = monospaceFont;
export const MONOSPACE_FONT_WEIGHT = 500;

export const TITLE_FONT_FAMILY = regularFont;
export const TITLE_FONT_WEIGHT = 600;
