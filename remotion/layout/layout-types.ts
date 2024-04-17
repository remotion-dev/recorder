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

export type RecordingsLayout = {
  displayLayout: Layout | null;
  webcamLayout: Layout;
  bRollLayout: Layout;
  bRollEnterDirection: BRollEnterDirection;
};

export type BRollEnterDirection = "top" | "bottom";
export type BRollType = "scale" | "fade";
