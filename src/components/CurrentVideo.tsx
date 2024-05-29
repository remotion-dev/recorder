import { CameraIcon } from "lucide-react";
import React from "react";
import { Dimensions } from "../../config/layout";
import { DisplayIcon } from "../DeviceItem";
import { Resolution } from "../PrefixAndResolution";
import { ResolutionLimiter } from "../ResolutionLimiter";
import { MaxResolution } from "../helpers/get-max-resolution-of-device";
import { VideoSize } from "../helpers/get-selected-video-source";
import { Divider } from "./Divider";

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  fontSize: 13,
  alignItems: "center",
  flex: 1,
  lineHeight: 1.4,
  cursor: "pointer",
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
  isScreenshare: boolean;
  onClick: () => void;
}> = ({
  label,
  resolution,
  maxResolution,
  sizeConstraint,
  setSizeConstraint,
  isScreenshare,
  onClick,
}) => {
  return (
    <div style={container} onClick={onClick}>
      <Divider></Divider>
      {isScreenshare ? <DisplayIcon></DisplayIcon> : <CameraIcon></CameraIcon>}
      <div style={spacer}></div>
      <div>
        <div>{label}</div>
        <span
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {resolution ? (
            <>
              <Resolution resolution={resolution} />
              {isScreenshare ? null : (
                <ResolutionLimiter
                  sizeConstraint={sizeConstraint}
                  setSizeConstraint={setSizeConstraint}
                  maxResolution={maxResolution}
                  deviceName={label}
                />
              )}
            </>
          ) : null}
        </span>
      </div>
      <div style={spacer}></div>
    </div>
  );
};
