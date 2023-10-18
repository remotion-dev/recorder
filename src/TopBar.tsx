import React from "react";

const topBarContainer: React.CSSProperties = {
  height: 60,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const TopBar: React.FC<{
  start: () => void;
  stop: () => void;
  recording: boolean;
  disabledByParent: boolean;
}> = ({ start, stop, recording, disabledByParent }) => {
  return (
    <div style={topBarContainer}>
      <div style={{ color: recording ? "red" : "black" }}>
        {recording ? "recording" : null}
      </div>
      {recording ? (
        <button type="button" disabled={!recording} onClick={stop}>
          Stop Recording
        </button>
      ) : (
        <button
          type="button"
          disabled={disabledByParent || recording !== false}
          onClick={start}
        >
          Start Recording
        </button>
      )}
    </div>
  );
};
