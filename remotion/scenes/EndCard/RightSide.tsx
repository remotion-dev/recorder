import React from "react";
import { AbsoluteFill } from "remotion";

const border = 6;

const ThumbnailPreview: React.FC = () => {
  return (
    <div
      style={{
        width: 613 + border * 3,
        height: 343 + border * 3,
        border: `${border}px solid black`,
      }}
    />
  );
};

export const ThumbnailContainers: React.FC = () => {
  // These thumbnails are optimized for YouTube and fit perfectly if:
  // - All thumbnails are made the minimum size
  // - The upper thumbnail is positioned at the highest point allowed
  // - The lower thumbnail is positioned a the lowest point allowed
  // Use the endscreen editor in YouTube Studio to get a better feeling for this.
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 100,
      }}
    >
      <ThumbnailPreview />
      <div style={{ height: 60 }} />
      <ThumbnailPreview />
      <div style={{ height: 20 }} />
    </AbsoluteFill>
  );
};
