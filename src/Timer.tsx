import React, { useEffect, useState } from "react";
import { formatTime } from "./helpers/format-time";

export const Timer: React.FC<{
  recording: number;
}> = ({ recording }) => {
  const [, setTime] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      setTime(Date.now() - recording);
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, [recording]);

  return <React.Fragment>{formatTime(Date.now() - recording)}</React.Fragment>;
};
