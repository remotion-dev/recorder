/* eslint-disable no-alert */
import { useCallback, useRef, useState } from "react";
export const View: React.FC<{
  name: string;
  recordAudio: boolean;
  devices: MediaDeviceInfo[];
}> = ({ name, recordAudio, devices }) => {
  const [mediaSource, setMediaSource] = useState<MediaStream | null>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);

  const [selectedExternalSource, setSelectedExternalSource] =
    useState<ConstrainDOMString | null>(null);

  const selectExternalSource = useCallback(() => {
    const microphone = devices.find(
      (d) => d.kind === "audioinput" && d.label.includes("NT-USB"),
    );

    if (!selectedExternalSource) {
      alert("No video selected");
      return;
    }

    if (selectedExternalSource === "undefined") {
      mediaSource?.getVideoTracks().forEach((track) => track.stop());
      setMediaSource(null);
      setSelectedExternalSource(null);
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
  }, [devices, mediaSource, recordAudio, selectedExternalSource]);

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
    <div>
      {name}
      <button type="button" onClick={selectScreen}>
        Select screen
      </button>
      <video ref={sourceRef} muted width="640" />
      <select
        onChange={(e) => {
          setSelectedExternalSource(e.target.value as ConstrainDOMString);
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
      <button type="button" onClick={selectExternalSource}>
        Confirm
      </button>{" "}
    </div>
  );
};
