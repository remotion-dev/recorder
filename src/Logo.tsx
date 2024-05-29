import React from "react";

const style: React.CSSProperties = {
  height: 40,
  width: 127,
};

export const Logo: React.FC = () => {
  return <img style={style} src="/logo.png" />;
};
