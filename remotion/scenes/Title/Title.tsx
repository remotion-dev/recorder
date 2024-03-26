import React from "react";
import { AbsoluteFill } from "remotion";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { COLORS, Theme } from "../../../config/themes";

export const Title: React.FC<{
  title: string;
  subtitle: string | null;
  theme: Theme;
}> = ({ subtitle, title, theme }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: TITLE_FONT_FAMILY,
          fontSize: 130,
          color: subtitle ? "#000" : "#fff",
          lineHeight: 1.1,
          fontWeight: TITLE_FONT_WEIGHT,
          border: "10px solid black",
          borderRadius: 20,
          padding: "15px 40px",
          display: "inline",
          background: subtitle ? "white" : COLORS[theme].ACCENT_COLOR,
          marginLeft: subtitle ? 30 : 0,
          position: "absolute",
          marginTop: subtitle ? 100 : 0,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily: TITLE_FONT_FAMILY,
            fontSize: 60,
            background: COLORS[theme].ACCENT_COLOR,
            lineHeight: 1.1,
            fontWeight: TITLE_FONT_WEIGHT,
            display: "inline",
            color: "white",
            border: "10px solid black",
            borderRadius: 20,
            padding: "15px 30px",
            position: "absolute",
            marginTop: -140,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
