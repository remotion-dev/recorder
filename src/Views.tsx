/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioSelector } from "./AudioSelector";

const BORDERWIDTH = 2;

const viewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: 10,
  padding: "10px 8px",
  backgroundColor: "#242424",
  borderRadius: 10,
  overflow: "hidden",
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
};

const sourceContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 10,
};

const cropIndicator: React.CSSProperties = {
  border: `${BORDERWIDTH}px solid #F7D449`,
  height: "100%",
  borderRadius: 10,
  aspectRatio: 350 / 400,
};

const dynamicCropIndicator: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  position: "absolute",
};

const videoWrapper: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const viewName: React.CSSProperties = {
  marginBottom: 10,
  display: "flex",
  justifyContent: "center",
};

export const prefixes = [
  "webcam",
  "display",
  "alternative1",
  "alternative2",
] as const;
export type Prefix = (typeof prefixes)[number];

export const View: React.FC<{
  devices: MediaDeviceInfo[];
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  prefix: Prefix;
}> = ({ devices, setMediaStream, prefix, mediaStream }) => {
  const sourceRef = useRef<HTMLVideoElement>(null);

  const [showCropIndicator, setShowCropIndicator] = useState(false);
  const [selectedAudioSource, setSelectedAudioSource] =
    useState<ConstrainDOMString | null>(null);
  const [selectedVideoSource, setSelectedVideoSource] =
    useState<ConstrainDOMString | null>(null);
  const recordAudio = prefix === "webcam";
  const [currentResolution, setCurrentResolution] = useState<{
    width: number | null;
    height: number | null;
  }>({ width: null, height: null });

  const resolutionString = useMemo(() => {
    return currentResolution.width && currentResolution.height
      ? `${currentResolution.width}x${currentResolution.height}`
      : "";
  }, [currentResolution.height, currentResolution.width]);

  const handleChange = useCallback(() => {
    setShowCropIndicator((prev) => !prev);
  }, []);

  const actualAudioSource: string | undefined = useMemo(() => {
    if (selectedAudioSource) {
      return selectedAudioSource as string;
    }

    const microphone = devices.find((d) => d.kind === "audioinput");

    if (!microphone) {
      return undefined;
    }

    return microphone.deviceId;
  }, [devices, selectedAudioSource]);

  const dynamicVideoStyle: React.CSSProperties = useMemo(() => {
    return {
      opacity: mediaStream ? 1 : 0,
      height: "100%",
    };
  }, [mediaStream]);

  const setVideoSource = useCallback(
    (newVideoSource: ConstrainDOMString | null) => {
      setVideoSource(newVideoSource);
    },
    [],
  );

  useEffect(() => {
    if (recordAudio) {
      return () => {
        mediaStream?.getVideoTracks().forEach((track) => track.stop());
        mediaStream?.getAudioTracks().forEach((track) => track.stop());
      };
    }

    return () => {
      mediaStream?.getVideoTracks().forEach((track) => track.stop());
    };
  }, [mediaStream, recordAudio]);

  useEffect(() => {
    if (selectedVideoSource === null) {
      setMediaStream(prefix, null);
      return;
    }

    const mediaStreamConstraints: MediaStreamConstraints =
      recordAudio && actualAudioSource
        ? {
            video: {
              deviceId: selectedVideoSource,
            },
            audio: { deviceId: actualAudioSource },
          }
        : {
            video: { deviceId: selectedVideoSource },
          };

    window.navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then((stream) => {
        if (sourceRef.current) {
          sourceRef.current.srcObject = stream;
          sourceRef.current.play();
        }

        const { width, height } = stream.getVideoTracks()[0].getSettings();
        setCurrentResolution({ width: width ?? null, height: height ?? null });
        setMediaStream(prefix, stream);
      })
      .catch((e) => {
        setMediaStream(prefix, null);
        alert(e);
      });
  }, [
    actualAudioSource,
    prefix,
    recordAudio,
    selectedVideoSource,
    setMediaStream,
  ]);

  const selectScreen = () => {
    window.navigator.mediaDevices
      // getDisplayMedia asks the user for permission to capture the screen
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setMediaStream(prefix, stream);
        if (!sourceRef.current) {
          return;
        }

        setCurrentResolution({ width: null, height: null });
        sourceRef.current.srcObject = stream;
        sourceRef.current.play();
      });
  };

  return (
    <div style={viewContainer}>
      <div style={viewName}>
        {resolutionString}
        {prefix === "webcam" ? <div style={{ flex: 1 }} /> : null}
        {prefix}
        {prefix === "webcam" ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <label htmlFor="indicator">Show Crop</label>
            <input
              id="toggleCropIndicator"
              type="checkbox"
              name="indicator"
              onChange={handleChange}
            />
          </div>
        ) : null}
      </div>
      <div style={videoWrapper}>
        <video ref={sourceRef} style={dynamicVideoStyle} muted />
        {showCropIndicator ? (
          <div style={dynamicCropIndicator}>
            <div style={cropIndicator} />
          </div>
        ) : null}
      </div>
      <div style={sourceContainer}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          Media Source
          <select
            onChange={(e) => {
              if (e.target.value === "undefined") {
                setSelectedVideoSource(null);
                setCurrentResolution({ width: null, height: null });
                return;
              }

              setSelectedVideoSource(e.target.value as ConstrainDOMString);
            }}
            style={{ margin: "10px 0px" }}
          >
            <option key={"unselected"} value={"undefined"}>
              --select video source--
            </option>
            {devices
              .filter((d) => d.kind === "videoinput")
              .map((d) => {
                return (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                );
              })}
          </select>
        </div>

        {prefix !== "webcam" ? (
          <button
            style={{ marginTop: 10 }}
            type="button"
            onClick={selectScreen}
          >
            Select screen
          </button>
        ) : null}

        {recordAudio ? (
          <AudioSelector
            devices={devices}
            setSelectedAudioSource={setSelectedAudioSource}
          />
        ) : null}
      </div>
    </div>
  );
};
