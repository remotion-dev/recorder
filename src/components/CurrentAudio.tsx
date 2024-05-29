import { MicIcon } from "lucide-react";
import React from "react";
import styles from "../currentmedia.module.css";
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

export const CurrentAudio: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => {
  return (
    <div className={styles.item} style={container} onClick={onClick}>
      <Divider></Divider>
      <MicIcon></MicIcon>
      <div style={spacer}></div>
      <div>{label}</div>
    </div>
  );
};
