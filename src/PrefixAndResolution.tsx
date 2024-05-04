import React from "react";

export const PrefixAndResolution: React.FC<{
  prefix: string;
  derivedResolutionString: string;
}> = ({ derivedResolutionString, prefix }) => {
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
      {derivedResolutionString}
    </div>
  );
};
