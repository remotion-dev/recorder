import React from "react";
import type { Dimensions } from "../config/layout";
import { ResolutionLimiter } from "./ResolutionLimiter";
import { MaxResolution } from "./helpers/get-max-resolution-of-device";
import { VideoSize } from "./helpers/get-selected-video-source";

export const PrefixAndResolution: React.FC<{
  prefix: string;
  resolution: Dimensions | null;
  sizeConstraint: VideoSize | null;
  setSizeConstraint: React.Dispatch<React.SetStateAction<VideoSize | null>>;
  deviceName: string | null;
  maxResolution: MaxResolution | null;
}> = ({
  prefix,
  resolution,
  sizeConstraint,
  setSizeConstraint,
  deviceName,
  maxResolution,
}) => {
  return (
    <div
      style={{
        fontSize: 13,
        textAlign: "left",
      }}
    >
      <span style={{ textTransform: "uppercase" }}> {prefix}</span>
      {resolution ? (
        <>
          <br />
          <span
            style={{
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <span>
              {resolution.width}x{resolution.height}
            </span>
            <ResolutionLimiter
              sizeConstraint={sizeConstraint}
              setSizeConstraint={setSizeConstraint}
              maxResolution={maxResolution}
              deviceName={deviceName as string}
            />
          </span>
        </>
      ) : null}
    </div>
  );
};
