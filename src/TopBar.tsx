import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

const topBarContainer: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 10,
  marginLeft: 10,
  alignItems: "center",
};

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedSeconds = seconds % 60;
  const formattedMinutes = minutes % 60;

  const timeArray = [];

  if (hours > 0) {
    timeArray.push(hours.toString().padStart(2, "0"));
  }

  timeArray.push(formattedMinutes.toString().padStart(2, "0"));
  timeArray.push(formattedSeconds.toString().padStart(2, "0"));

  return timeArray.join(":");
};

export const TopBar: React.FC<{
  start: () => void;
  stop: () => void;
  recording: false | number;
  disabledByParent: boolean;
}> = ({ start, stop, recording, disabledByParent }) => {
  const disabled = disabledByParent || recording !== false;

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 800);
    return () => clearInterval(intervalId);
  }, []);

  const recordCircle = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="10px"
      viewBox="0 0 512 512"
      style={{ opacity: disabledByParent ? 0.4 : 1 }}
    >
      <path fill="red" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );

  const blinkingCircle = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="10px"
      viewBox="0 0 512 512"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <path fill="red" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );

  return (
    <div style={topBarContainer}>
      {recording ? (
        <>
          <Button
            variant={"outline"}
            type="button"
            disabled={!recording}
            onClick={stop}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            Stop recording
          </Button>
          {blinkingCircle}
          {formatTime(Date.now() - recording)}
        </>
      ) : (
        <Button
          variant={"outline"}
          type="button"
          disabled={disabled}
          onClick={start}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          {recordCircle}
          Start recording
        </Button>
      )}
    </div>
  );
};
