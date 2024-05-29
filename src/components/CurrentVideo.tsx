import { CameraIcon } from "lucide-react";
import React, { useCallback } from "react";
import { DisplayIcon } from "../DeviceItem";
import { Resolution } from "../PrefixAndResolution";
import { ResolutionAndFps } from "../Stream";
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

const buttonStyle: React.CSSProperties = {
  display: "inline",
  color: "rgba(255, 255, 255, 0.5)",
  borderBottom: "1px solid",
};

export const CurrentVideo: React.FC<{
  label: string;
  resolution: ResolutionAndFps | null;
  isScreenshare: boolean;
  onClick: () => void;
  setResolutionLimiterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  label,
  resolution,
  isScreenshare,
  onClick,
  setResolutionLimiterOpen,
}) => {
  const onOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      setResolutionLimiterOpen(true);
    },
    [setResolutionLimiterOpen],
  );
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
              <div style={{ width: 4 }}></div>
              <button onClick={onOpen} style={buttonStyle}>
                Change
              </button>
            </>
          ) : null}
        </span>
      </div>
      <div style={spacer}></div>
    </div>
  );
};
