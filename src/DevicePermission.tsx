import type { ReactNode } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt" | "initial";

const largeContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
};

const explanationWrapper: React.CSSProperties = {
  display: "flex",
  textAlign: "start",
};

const explanationContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  maxWidth: 800,
};

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
  maxWidth: 400,
  margin: 20,
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
  const [state, setState] = useState<PermissionState>("initial");

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

  if (state === "initial") return null;

  return (
    <div style={peripheral}>
      <div>{type === "audio" ? "Microphone:" : "Camera:"}</div>
      <div>{state === "granted" ? "access granted" : "access denied"}</div>
    </div>
  );
};

export const DevicePermission: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [audioState, setAudioState] = useState<PermissionState>("initial");
  const [videoState, setVideoState] = useState<PermissionState>("initial");

  const isInitialState = useMemo(() => {
    return audioState === "initial" && videoState === "initial";
  }, [audioState, videoState]);

  if (audioState === "granted" && videoState === "granted") {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <div style={largeContainer}>
      <div style={container}>
        {isInitialState ? null : (
          <div style={title}>Required peripheral permissions</div>
        )}
        <div style={innerContainer}>
          <Permission type="audio" onGranted={() => setAudioState("granted")} />
          <Permission type="video" onGranted={() => setVideoState("granted")} />
        </div>
      </div>

      {isInitialState ? null : (
        <div>
          This app requires access to your microphone and camera to work.
          <div style={explanationContainer}>
            <div style={explanationWrapper}>
              1. Click on the padlock/info icon 🛡️ next to the web address in
              your browser&apos;s address bar.
            </div>
            <div style={explanationWrapper}>
              2. In the dropdown menu that appears, locate the
              &apos;Permissions&apos; or &apos;Site settings&apos; option.
            </div>
            <div style={explanationWrapper}>
              3. Look for &apos;Camera&apos; and &apos;Microphone&apos; settings
              and ensure they are set to &apos;Allow&apos; or &apos;Ask&apos;
            </div>
            <div style={explanationWrapper}>
              4. Refresh the page if necessary to apply the changes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
