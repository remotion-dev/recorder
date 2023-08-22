import { interpolate } from "remotion";

export const getDisplayTranslation = ({
  enter,
  exit,
  width,
}: {
  enter: number;
  exit: number;
  width: number;
}) => {
  const translationX =
    interpolate(enter, [0, 1], [width, 0]) +
    interpolate(exit, [0, 1], [0, -width]) +
    "px 0";
  const translationY = 0;

  return { translationX, translationY };
};

export const getWebcamTranslation = ({
  enter,
  exit,
  width,
  height,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
}) => {
  const translationX = interpolate(exit, [0, 1], [0, -width]);
  const translationY = interpolate(enter, [0, 1], [height, 0]);
  return { translationX, translationY };
};
