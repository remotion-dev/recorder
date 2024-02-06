import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import { subtitleMonospaceFont } from "../../configuration";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedSeconds = seconds % 60;
  const formattedMinutes = minutes % 60;

  const timeArray = [];

  if (hours > 0) {
    timeArray.push(hours.toString().padStart(2, "0"));
  }

  timeArray.push(formattedMinutes);
  timeArray.push(formattedSeconds.toString().padStart(2, "0"));

  return timeArray.join(":");
};

export const TableOfContentItem: React.FC<{
  title: string;
  startTime: number;
}> = ({ title, startTime }) => {
  const { fps } = useVideoConfig();

  const time = useMemo(() => {
    return Math.floor(startTime / fps);
  }, [fps, startTime]);

  return (
    <div
      style={{
        fontFamily: subtitleMonospaceFont,
        fontSize: 46,
        fontWeight: 400,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        lineHeight: 1.5,
      }}
    >
      <div style={{ flex: 1 }}>{title}</div>
      <div
        style={{
          width: 150,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatTime(time)}
      </div>
    </div>
  );
};
