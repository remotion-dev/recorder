import type { ReactNode } from "react";
import React, { useCallback, useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt";

const innerContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  flexDirection: "column",
  padding: "10px",
};
const container: React.CSSProperties = {
  border: "1px solid white",
  borderRadius: 10,
  padding: 12,
};

const title: React.CSSProperties = {
  fontSize: "1.5rem",
};

const peripheral: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
};

const Permission: React.FC<{
  type: "audio" | "video";
  onGranted: () => void;
}> = ({ type, onGranted }) => {
  const [state, setState] = useState<PermissionState | null>(null);

  const run = useCallback(async () => {
    const name =
      type === "audio"
        ? ("microphone" as PermissionName)
        : ("camera" as PermissionName);
    const result = await navigator.permissions.query({ name });
    setState(result.state);

    if (result.state === "prompt") {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: type === "audio",
        });
      } catch (err) {
        setState("denied");
        return;
      }
    }

    if (result.state === "granted") {
      onGranted();
    }
  }, [onGranted, type]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div style={peripheral}>
      <div>{type === "audio" ? "Microphone:" : "Camera:"}</div>
      <div>{state === "granted" ? "acces granted" : "acces denied"}</div>
    </div>
  );
};

export const DevicePermission: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [audioGranted, setAudioGranted] = useState(false);
  const [videoGranted, setVideoGranted] = useState(false);

  if (audioGranted && videoGranted) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <div style={container}>
      <div style={title}>Required peripheral permissions</div>
      <div style={innerContainer}>
        <Permission type="audio" onGranted={() => setAudioGranted(true)} />
        <Permission type="video" onGranted={() => setVideoGranted(true)} />
      </div>
    </div>
  );
};
