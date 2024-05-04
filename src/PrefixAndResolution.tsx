import React from "react";
import type { Dimensions } from "../config/layout";

export const PrefixAndResolution: React.FC<{
  prefix: string;
  resolution: Dimensions | null;
}> = ({ prefix, resolution }) => {
  return (
    <div
      style={{
        fontSize: 13,
        textAlign: "left",
        textTransform: "uppercase",
      }}
    >
      {prefix}
      <br />
      {resolution ? (
        <>
          {resolution.width}x{resolution.height}
        </>
      ) : null}
    </div>
  );
};
