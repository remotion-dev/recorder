export type Layout = {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: number;
  opacity: number;
};

export type LayoutAndFade = {
  layout: Layout;
  shouldFadeRecording: boolean;
};
