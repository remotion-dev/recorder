import React, { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill } from "remotion";
import { Spinner } from "./components/Spinner";
import type { SelectedSource } from "./helpers/get-selected-video-source";
import { getVideoStream } from "./helpers/get-video-stream";
import { Prefix } from "./helpers/prefixes";

const container: React.CSSProperties = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

type StreamState = "initial" | "loading" | "loaded";

export type SelectedVideoSource =
  | {
      type: "camera";
      constrain: ConstrainDOMString;
    }
  | {
      type: "display";
    };

export type ResolutionAndFps = {
  width: number;
  height: number;
  fps: number;
};

export const Stream: React.FC<{
  prefix: Prefix;
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  setResolution: React.Dispatch<React.SetStateAction<ResolutionAndFps | null>>;
  recordAudio: boolean;
  selectedVideoSource: SelectedSource | null;
  selectedAudioSource: ConstrainDOMString | null;
  preferPortrait: boolean;
}> = ({
  prefix,
  mediaStream,
  setMediaStream,
  setResolution,
  recordAudio,
  selectedVideoSource,
  selectedAudioSource,
  preferPortrait,
}) => {
  const [streamState, setStreamState] = useState<StreamState>("initial");

  const sourceRef = useRef<HTMLVideoElement>(null);

  const videoStyle: React.CSSProperties = useMemo(() => {
    return {
      opacity: mediaStream ? 1 : 0,
      height: "100%",
    };
  }, [mediaStream]);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }

    const track = mediaStream.getVideoTracks()[0];
    if (!track) {
      return;
    }

    track.onended = () => {
      setMediaStream(prefix, null);
    };
  }, [mediaStream, prefix, setMediaStream]);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }

    return () => {
      if (recordAudio) {
        mediaStream.getAudioTracks().forEach((track) => track.stop());
      }

      mediaStream.getVideoTracks().forEach((track) => track.stop());
    };
  }, [mediaStream, recordAudio]);

  useEffect(() => {
    const { current } = sourceRef;
    if (!current) {
      return;
    }

    if (selectedVideoSource === null) {
      setMediaStream(prefix, null);
      return;
    }

    setStreamState("loading");

    const cleanup: (() => void)[] = [];

    getVideoStream({
      preferPortrait,
      recordAudio,
      selectedAudioSource,
      selectedVideoSource,
    })
      .then((stream) => {
        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) {
          throw new Error("No video track");
        }

        const settings = videoTrack.getSettings();
        if (!settings) {
          throw new Error("No video settings");
        }

        setResolution({
          width: settings.width as number,
          height: settings.height as number,
          fps: settings.frameRate as number,
        });

        if (current) {
          current.srcObject = stream;
          current.play();
        }

        cleanup.push(() => {
          stream.getVideoTracks().forEach((track) => track.stop());
          stream.getAudioTracks().forEach((track) => track.stop());
          current.srcObject = null;
        });

        setMediaStream(prefix, stream);
        setStreamState("loaded");
      })
      .catch((e) => {
        if (e.name === "NotReadableError") {
          // eslint-disable-next-line no-alert
          alert(
            "The selected device is not readable. Is the device already in use by another program?",
          );
        } else {
          console.log(e);
        }

        setMediaStream(prefix, null);
        setStreamState("initial");
      });

    return () => {
      cleanup.forEach((f) => f());
    };
  }, [
    preferPortrait,
    prefix,
    recordAudio,
    selectedAudioSource,
    selectedVideoSource,
    setMediaStream,
    setResolution,
  ]);

  return (
    <AbsoluteFill style={container} id={prefix + "-video-container"}>
      <video ref={sourceRef} muted style={videoStyle} />
      {streamState === "loading" ? <Spinner /> : null}
    </AbsoluteFill>
  );
};
