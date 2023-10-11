/* eslint-disable no-alert */
import { useCallback, useRef, useState } from "react";
export const View: React.FC<{
  name: string;
  recordAudio: boolean;
  devices: MediaDeviceInfo[];
}> = ({ name, recordAudio, devices }) => {
  const [mediaSource, setMediaSource] = useState<MediaStream | null>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<ConstrainDOMString | null>(
    null,
  );
  const [selectedExternalSource, setSelectedExternalSource] =
    useState<ConstrainDOMString | null>(null);

  console.log("external video source", selectedExternalSource);
  console.log(recordAudio, selectedVideo, sourceRef, mediaSource);

  const selectExternalSource = useCallback(() => {
    console.log(
      "inside select external source. Selected external source: ",
      selectedExternalSource,
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

    window.navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedExternalSource },
      })
      .then((stream) => {
        console.log("inside then. Stream: ", stream);
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
  }, [mediaSource, selectedExternalSource]);

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
      <button type="button" onClick={selectScreen}>
        Select screen
      </button>
      <video ref={sourceRef} muted width="640" />
      <select
        onChange={(e) => {
          console.log("changing");
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
