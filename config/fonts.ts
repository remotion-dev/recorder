import {
  fontFamily as monospaceFont,
  fontFamily as regularFont,
  loadFont as loadMonospace,
  loadFont as loadRegular,
} from "@remotion/google-fonts/RobotoCondensed";

loadRegular();
loadMonospace();

export const REGULAR_FONT_FAMILY = regularFont;
export const REGULAR_FONT_WEIGHT = 600;

export const MONOSPACE_FONT_FAMILY = monospaceFont;
export const MONOSPACE_FONT_WEIGHT = 500;

export const TITLE_FONT_FAMILY = regularFont;
export const TITLE_FONT_WEIGHT = 500;
