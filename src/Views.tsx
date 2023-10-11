/* eslint-disable no-alert */
import { useCallback, useEffect, useRef, useState } from "react";
import type { CustomMediaStream } from "./App";

const viewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: 10,
};

export const View: React.FC<{
  name: string;
  recordAudio: boolean;
  devices: MediaDeviceInfo[];
  type: "peripheral" | "screen";
  addMediaSource: (source: CustomMediaStream) => void;
  removeMediaSource: (source: CustomMediaStream) => void;
}> = ({
  name,
  recordAudio,
  devices,
  type,
  addMediaSource,
  removeMediaSource,
}) => {
  const [mediaSource, setMediaSource] = useState<MediaStream | null>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);

  console.log("devices", devices);

  useEffect(() => {
    if (!mediaSource) {
      return;
    }

    addMediaSource({ mediaStream: mediaSource, prefix: name });
  }, [addMediaSource, mediaSource, name]);

  const selectExternalSource = useCallback(
    (selectedExternalSource: ConstrainDOMString | null) => {
      const microphone = devices.find(
        (d) => d.kind === "audioinput" && d.label.includes("NT-USB"),
      );

      if (!selectedExternalSource) {
        alert("No video selected");
        return;
      }

      if (selectedExternalSource === "undefined") {
        mediaSource?.getVideoTracks().forEach((track) => track.stop());
        if (mediaSource) {
          removeMediaSource({ mediaStream: mediaSource, prefix: name });
        }

        setMediaSource(null);
        return;
      }

      const mediaStreamContraints = recordAudio
        ? {
            video: {
              deviceId: selectedExternalSource,
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: { deviceId: microphone?.deviceId },
          }
        : {
            video: { deviceId: selectedExternalSource },
          };

      window.navigator.mediaDevices
        .getUserMedia(mediaStreamContraints)
        .then((stream) => {
          if (sourceRef.current) {
            sourceRef.current.srcObject = stream;
            sourceRef.current.play();
          }

          setMediaSource(stream);
        })
        .catch((e) => {
          setMediaSource(null);
          alert(e);
        });
    },
    [devices, mediaSource, name, recordAudio, removeMediaSource],
  );

  const selectScreen = () => {
    window.navigator.mediaDevices
      // getDisplayMedia asks the user for permission to capture the screen
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setMediaSource(stream);
        if (!sourceRef.current) {
          return;
        }

        sourceRef.current.srcObject = stream;
        sourceRef.current.play();
      });
  };

  return (
    <div style={viewContainer}>
      {name}
      <video ref={sourceRef} style={{ marginTop: 6 }} muted width="640" />
      {type === "screen" ? (
        <button type="button" onClick={selectScreen}>
          Select screen
        </button>
      ) : (
        <select
          onChange={(e) => {
            selectExternalSource(e.target.value as ConstrainDOMString);
          }}
        >
          <option key={"unselected"} value={"undefined"}>
            --select video source--
          </option>
          {devices
            .filter((d) => d.kind === "videoinput")
            .map((d) => {
              return (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label} ({d.kind})
                </option>
              );
            })}
        </select>
      )}

      {/* <button type="button" onClick={selectExternalSource}>
        Confirm
      </button>{" "} */}
    </div>
  );
};
