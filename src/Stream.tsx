import React, { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill } from "remotion";
import { Spinner } from "./components/Spinner";
import type { SelectedSource } from "./helpers/get-selected-video-source";
import {
  getCameraStreamConstraints,
  getVideoStream,
} from "./helpers/get-video-stream";
import { Prefix } from "./helpers/prefixes";

const container: React.CSSProperties = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

type StreamState =
  | {
      type: "initial";
    }
  | { type: "loading" }
  | { type: "loaded" }
  | { type: "error"; error: string };

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
  const [streamState, setStreamState] = useState<StreamState>({
    type: "initial",
  });

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

    setStreamState({ type: "loading" });

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
        setStreamState({ type: "loaded" });
      })
      .catch((e) => {
        console.log(e);

        const errMessage =
          e.name === "NotReadableError"
            ? "The selected device is not readable. This could be due to another app using this camera."
            : e.name === "OverconstrainedError"
              ? `Could not find a resolution satisfying these constraints: ${JSON.stringify(
                  getCameraStreamConstraints(
                    selectedVideoSource,
                    preferPortrait,
                  ),
                )}`
              : e.message || e.name;

        setMediaStream(prefix, null);
        setStreamState({
          type: "error",
          error: errMessage,
        });
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
      {streamState.type === "loading" ? <Spinner /> : null}
      {streamState.type === "error" ? (
        <AbsoluteFill
          style={{
            padding: 20,
            textWrap: "balance",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {streamState.error}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
