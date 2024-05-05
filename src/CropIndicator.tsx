import type { CSSProperties } from "react";
import React, { useMemo } from "react";
import type { Dimensions } from "../config/layout";

const cropIndicator: React.CSSProperties = {
  border: "2px solid #F7D449",
  height: "100%",
  borderRadius: 10,
  aspectRatio: 350 / 400,
};

export const CropIndicator: React.FC<{
  resolution: Dimensions;
}> = ({ resolution: { height, width } }) => {
  const dynamicCropIndicator: CSSProperties = useMemo(() => {
    return {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      aspectRatio: width / height,
      maxHeight: "100%",
    };
  }, [height, width]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <div style={dynamicCropIndicator}>
        <div style={cropIndicator} />
      </div>
    </div>
  );
};
