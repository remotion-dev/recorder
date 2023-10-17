/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CustomMediaStream } from "./App";
const BORDERWIDTH = 2;
const viewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: 10,
  padding: "10px 8px",
  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
  borderRadius: 10,
};

const cropIndicator: React.CSSProperties = {
  position: "absolute",
  border: `${BORDERWIDTH}px solid red` /* You can customize the border style */,
  top: -BORDERWIDTH /* Adjust the top position as needed */,
  left: "0px" /* Adjust the left position as needed */,
  height: "100%" /* Adjust the height of the square */,
  borderRadius: 20,
};

const videoStyle: React.CSSProperties = {
  maxHeight: window.innerHeight / 2.5,
  position: "relative",
};
const viewName: React.CSSProperties = {
  marginBottom: 10,
  display: "flex",
  justifyContent: "center",
};

export const View: React.FC<{
  name: string;
  recordAudio: boolean;
  devices: MediaDeviceInfo[];
  type: "peripheral" | "screen";
  addMediaSource: (source: CustomMediaStream) => void;
  removeMediaSource: (source: CustomMediaStream) => void;
  setWebcam: React.Dispatch<React.SetStateAction<boolean>>;
  derivedAudioSource: string | undefined;
}> = ({
  name,
  recordAudio,
  devices,
  type,
  addMediaSource,
  removeMediaSource,
  setWebcam,
  derivedAudioSource,
}) => {
  const [mediaSource, setMediaSource] = useState<MediaStream | null>(null);
  const sourceRef = useRef<HTMLVideoElement>(null);
  const [videoElemWidth, setVideoElemWidth] = useState(0);
  const [videoElemHeight, setVideoElemHeight] = useState(0);
  const [showCropIndicator, setShowCropIndicator] = useState(false);

  const handleChange = useCallback(() => {
    setShowCropIndicator((prev) => !prev);
  }, []);

  const dynamicVideoStyle: React.CSSProperties = useMemo(() => {
    return {
      ...videoStyle,
      opacity: mediaSource ? 1 : 0,
    };
  }, [mediaSource]);
  useEffect(() => {
    if (!mediaSource) {
      return;
    }

    addMediaSource({ mediaStream: mediaSource, prefix: name });
  }, [addMediaSource, mediaSource, name]);

  useEffect(() => {
    if (!sourceRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      setVideoElemWidth(entries[0].contentRect.width);
      setVideoElemHeight(entries[0].contentRect.height);
    });

    observer.observe(sourceRef.current);

    // ???
    return () => {
      if (sourceRef.current) {
        observer.unobserve(sourceRef.current);
      }
    };
  }, []);
  const dynCropIndicator: React.CSSProperties = useMemo(() => {
    if (!videoElemWidth && !videoElemHeight) {
      return cropIndicator;
    }

    const derivedWidth = (videoElemHeight / 400) * 350;
    const derivedHeight = videoElemHeight;
    return {
      ...cropIndicator,
      width: derivedWidth,
      height: derivedHeight,
      left: (videoElemWidth - derivedWidth) / 2,
    };
  }, [videoElemWidth, videoElemHeight]);

  const selectExternalSource = useCallback(
    (selectedExternalSource: ConstrainDOMString | null) => {
      const isWebcam = name === "webcam";

      if (!selectedExternalSource) {
        alert("No video selected");
        return;
      }

      if (selectedExternalSource === "undefined") {
        mediaSource?.getVideoTracks().forEach((track) => track.stop());
        if (mediaSource) {
          removeMediaSource({ mediaStream: mediaSource, prefix: name });
        }

        if (isWebcam) {
          mediaSource?.getAudioTracks().forEach((track) => track.stop());
          setWebcam(false);
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
            audio: { deviceId: derivedAudioSource },
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
          if (isWebcam) {
            setWebcam(true);
          }
        })
        .catch((e) => {
          if (isWebcam) {
            setWebcam(false);
          }

          setMediaSource(null);
          alert(e);
        });
    },
    [
      derivedAudioSource,
      mediaSource,
      name,
      recordAudio,
      removeMediaSource,
      setWebcam,
    ],
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
      <div style={viewName}>
        {name === "webcam" ? <div style={{ flex: 1 }} /> : null}
        {name}
        {name === "webcam" ? (
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

      <div style={{ position: "relative" }}>
        <video ref={sourceRef} style={dynamicVideoStyle} muted width="640" />
        {showCropIndicator ? <div style={dynCropIndicator} /> : null}
      </div>

      <div style={{ flex: 1 }} />
      {type === "screen" ? (
        <button style={{ marginTop: 10 }} type="button" onClick={selectScreen}>
          Select screen
        </button>
      ) : (
        <select
          onChange={(e) => {
            selectExternalSource(e.target.value as ConstrainDOMString);
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
                  {d.label} ({d.kind})
                </option>
              );
            })}
        </select>
      )}
    </div>
  );
};
