/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import { getDeviceLabel } from "./App";
import { AudioSelector } from "./AudioSelector";
import { Spinner } from "./components/Spinner";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { VolumeMeter } from "./components/VolumeMeter";
import { ToggleCrop } from "./ToggleCrop";

const BORDERWIDTH = 2;

const viewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: 10,
  backgroundColor: "#242424",
  borderRadius: 10,
  overflow: "hidden",
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
};

const cropIndicator: React.CSSProperties = {
  border: `${BORDERWIDTH}px solid #F7D449`,
  height: "100%",
  borderRadius: 10,
  aspectRatio: 350 / 400,
};

const videoWrapper: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const viewName: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: 4,
  paddingLeft: 10,
};

export const prefixes = [
  WEBCAM_PREFIX,
  "display",
  "alternative1",
  "alternative2",
] as const;
export type Prefix = (typeof prefixes)[number];

type StreamState = "initial" | "loading" | "loaded";

const localStorageKey = "showCropIndicator";

export const View: React.FC<{
  devices: MediaDeviceInfo[];
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  prefix: Prefix;
}> = ({ devices, setMediaStream, prefix, mediaStream }) => {
  const sourceRef = useRef<HTMLVideoElement>(null);

  const initialCropIndicatorState = useMemo(() => {
    return (
      localStorage.getItem(localStorageKey) === "true" &&
      prefix === WEBCAM_PREFIX
    );
  }, [prefix]);

  const [showCropIndicator, setShowCropIndicator] = useState(
    initialCropIndicatorState,
  );

  const [selectedAudioSource, setSelectedAudioSource] =
    useState<ConstrainDOMString | null>(null);
  const [selectedVideoSource, setSelectedVideoSource] =
    useState<ConstrainDOMString | null>(null);
  const recordAudio = prefix === WEBCAM_PREFIX;
  const [resolutionString, setResolutionString] = useState<string>("");
  const [streamState, setStreamState] = useState<StreamState>("initial");

  const videoWidth = document.querySelector("video")?.videoWidth;
  const videoHeight = document.querySelector("video")?.videoHeight;
  const dynamicCropIndicator: CSSProperties = useMemo(() => {
    return {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      aspectRatio:
        videoWidth && videoHeight ? videoWidth / videoHeight : 16 / 9,
      maxHeight: "100%",
    };
  }, [videoHeight, videoWidth]);

  const onLoadedMetadata = useCallback(() => {
    if (mediaStream) {
      setResolutionString(
        `${sourceRef.current?.videoWidth}x${sourceRef.current?.videoHeight}`,
      );
    } else {
      setResolutionString("");
    }
  }, [mediaStream]);

  const derivedResolutionString = useMemo(() => {
    if (!mediaStream) {
      return "";
    }

    return resolutionString;
  }, [mediaStream, resolutionString]);

  const handleChange = useCallback(() => {
    setShowCropIndicator((prev) => {
      window.localStorage.setItem(localStorageKey, String(!prev));
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (mediaStream) {
      const track = mediaStream.getVideoTracks()[0];
      if (!track) {
        return;
      }

      track.onended = () => {
        setMediaStream(prefix, null);
      };
    }
  }, [mediaStream, prefix, setMediaStream]);

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

    setStreamState("loading");
    const mediaStreamConstraints: MediaStreamConstraints =
      recordAudio && selectedAudioSource
        ? {
            video: {
              deviceId: selectedVideoSource,
              width: { ideal: 1920 },
            },
            audio: { deviceId: selectedAudioSource },
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

        setMediaStream(prefix, stream);
        setStreamState("loaded");
      })
      .catch((e) => {
        if (e.name === "NotReadableError") {
          alert(
            "The selected device is not readable. Is the device already in use by another program?",
          );
        } else if (e.name === "NotAllowedError") {
          console.log(e);
        }

        setMediaStream(prefix, null);
        setStreamState("initial");
      });
  }, [
    selectedAudioSource,
    prefix,
    recordAudio,
    selectedVideoSource,
    setMediaStream,
  ]);
  const selectScreen = () => {
    window.navigator.mediaDevices
      // GetDisplayMedia asks the user for permission to capture the screen
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setMediaStream(prefix, stream);
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
        <div
          style={{
            fontSize: 13,
            textAlign: "left",
            textTransform: "uppercase",
          }}
        >
          {prefix}
          <br />
          {derivedResolutionString}
        </div>
        {prefix === WEBCAM_PREFIX ? (
          <ToggleCrop
            pressed={showCropIndicator}
            onPressedChange={handleChange}
          />
        ) : null}
        <Select
          onValueChange={(value) => {
            if (value === "undefined") {
              setSelectedVideoSource(null);
              return;
            }

            setSelectedVideoSource(value as ConstrainDOMString);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select video" />
          </SelectTrigger>
          <SelectContent>
            {devices
              .filter((d) => d.kind === "videoinput")
              .map((d) => {
                const label = getDeviceLabel(d);
                return (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {label}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        {prefix !== WEBCAM_PREFIX ? (
          <Button type="button" onClick={selectScreen}>
            Select screen
          </Button>
        ) : null}

        {recordAudio ? (
          <AudioSelector
            devices={devices}
            setSelectedAudioSource={setSelectedAudioSource}
            audioSource={selectedAudioSource}
          />
        ) : null}
      </div>
      {prefix === WEBCAM_PREFIX ? (
        <VolumeMeter mediaStream={mediaStream} />
      ) : null}
      <div style={videoWrapper} id={prefix + "-video-container"}>
        <video
          ref={sourceRef}
          muted
          style={dynamicVideoStyle}
          onLoadedMetadata={onLoadedMetadata}
        />

        {streamState === "loading" ? <Spinner /> : null}
        {showCropIndicator ? (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div style={dynamicCropIndicator}>
              <div style={cropIndicator} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
