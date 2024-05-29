import React from "react";
import { Dimensions } from "../../config/layout";
import { Resolution } from "../PrefixAndResolution";
import { ResolutionLimiter } from "../ResolutionLimiter";
import { MaxResolution } from "../helpers/get-max-resolution-of-device";
import { VideoSize } from "../helpers/get-selected-video-source";
import { Divider } from "./Divider";
import { CameraIcon } from "./StreamPicker";

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  fontSize: 13,
  alignItems: "center",
  flex: 1,
  lineHeight: 1.4,
};

const spacer: React.CSSProperties = {
  width: 12,
};

export const CurrentVideo: React.FC<{
  label: string;
  resolution: Dimensions | null;
  sizeConstraint: VideoSize | null;
  maxResolution: MaxResolution | null;
  setSizeConstraint: React.Dispatch<React.SetStateAction<VideoSize | null>>;
}> = ({
  label,
  resolution,
  maxResolution,
  sizeConstraint,
  setSizeConstraint,
}) => {
  return (
    <div style={container}>
      <Divider></Divider>
      <CameraIcon></CameraIcon>
      <div style={spacer}></div>
      <div>
        <div>{label}</div>
        {resolution !== null ? (
          <span
            style={{
              whiteSpace: "nowrap",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Resolution resolution={resolution} />
            <ResolutionLimiter
              sizeConstraint={sizeConstraint}
              setSizeConstraint={setSizeConstraint}
              maxResolution={maxResolution}
              deviceName={label}
            />
          </span>
        ) : null}
      </div>
      <div style={spacer}></div>
    </div>
  );
};
