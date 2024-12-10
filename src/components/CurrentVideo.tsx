import { CameraIcon } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { DisplayIcon } from "../DeviceItem";
import { Resolution } from "../PrefixAndResolution";
import { ResolutionAndFps } from "../Stream";

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
  canShowResolutionLimiter: boolean | null;
}> = ({
  label,
  resolution,
  isScreenshare,
  onClick,
  setResolutionLimiterOpen,
  canShowResolutionLimiter,
}) => {
  const onOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      setResolutionLimiterOpen(true);
    },
    [setResolutionLimiterOpen],
  );

  const [hovered, setHovered] = useState(false);

  const onPointerEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const container: React.CSSProperties = useMemo(() => {
    return {
      display: "flex",
      flexDirection: "row",
      fontSize: 13,
      alignItems: "center",
      flex: 1,
      lineHeight: 1.4,
      cursor: "pointer",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 10,
      background: hovered ? "rgba(0, 0, 0, 0.5)" : "transparent",
      minHeight: 48,
    };
  }, [hovered]);

  return (
    <div
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={container}
      onClick={onClick}
    >
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
              {canShowResolutionLimiter ? (
                <>
                  <div style={{ width: 4 }}></div>
                  <button onClick={onOpen} style={buttonStyle}>
                    Settings
                  </button>
                </>
              ) : null}
            </>
          ) : null}
        </span>
      </div>
      <div style={spacer}></div>
    </div>
  );
};
