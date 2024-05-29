import React from "react";
import type { Dimensions } from "../config/layout";

export const PrefixLabel: React.FC<{
  prefix: string;
}> = ({ prefix }) => {
  return (
    <div
      style={{
        fontSize: 13,
        textAlign: "left",
      }}
    >
      <span style={{ textTransform: "uppercase" }}>{prefix}</span>
    </div>
  );
};

export const Resolution: React.FC<{
  resolution: Dimensions;
}> = ({ resolution }) => {
  return (
    <>
      <span
        style={{
          whiteSpace: "nowrap",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          {resolution.width}x{resolution.height}
        </span>
      </span>
    </>
  );
};
