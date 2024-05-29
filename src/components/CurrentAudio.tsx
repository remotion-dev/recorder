import React from "react";
import { Divider } from "./Divider";
import { MicIcon } from "./StreamPicker";

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

export const CurrentAudio: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => {
  return (
    <div style={container} onClick={onClick}>
      <Divider></Divider>
      <MicIcon></MicIcon>
      <div style={spacer}></div>
      <div>{label}</div>
    </div>
  );
};
