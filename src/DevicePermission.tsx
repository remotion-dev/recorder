import type { ReactNode } from "react";
import React, { useCallback, useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt";

const Permission: React.FC<{
  type: "audio" | "video";
  onGranted: () => void;
}> = ({ type, onGranted }) => {
  const [state, setState] = useState<PermissionState | null>();

  const run = useCallback(async () => {
    const name =
      type === "audio"
        ? ("microphone" as PermissionName)
        : ("camera" as PermissionName);
    const result = await navigator.permissions.query({ name });

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

    setState(result.state);
  }, [onGranted, type]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div>
      {type}
      {state}
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
    <>
      <Permission type="audio" onGranted={() => setAudioGranted(true)} />
      <Permission type="video" onGranted={() => setVideoGranted(true)} />
    </>
  );
};
