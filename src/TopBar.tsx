import React, { useEffect, useState } from "react";

const topBarContainer: React.CSSProperties = {
  height: 60,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
};

export const TopBar: React.FC<{
  start: () => void;
  stop: () => void;
  recording: boolean;
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
      height="18px"
      viewBox="0 0 512 512"
      style={{ opacity: disabledByParent ? 0.4 : 1 }}
    >
      <path fill="red" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );

  const blinkingCircle = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
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
          <button
            type="button"
            disabled={!recording}
            onClick={stop}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            Stop
          </button>
          {blinkingCircle}
        </>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={start}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          Record
          {recordCircle}
        </button>
      )}
    </div>
  );
};
