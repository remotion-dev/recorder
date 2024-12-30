import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Spinner } from "./components/Spinner";
import type { SelectedSource } from "./helpers/get-selected-video-source";
import {
  getCameraStreamConstraints,
  getVideoStream,
} from "./helpers/get-video-stream";
import { Prefix } from "./helpers/prefixes";
import { useMediaSources, useSetMediaStream } from "./state/media-sources";

const container: React.CSSProperties = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

export type ResolutionAndFps = {
  width: number;
  height: number;
  fps: number;
};

export const Stream: React.FC<{
  prefix: Prefix;
  setResolution: React.Dispatch<React.SetStateAction<ResolutionAndFps | null>>;
  recordAudio: boolean;
  selectedVideoSource: SelectedSource | null;
  selectedAudioSource: ConstrainDOMString | null;
  preferPortrait: boolean;
  clear: () => void;
}> = ({
  prefix,
  setResolution,
  recordAudio,
  selectedVideoSource,
  selectedAudioSource,
  preferPortrait,
  clear,
}) => {
  const mediaSources = useMediaSources();
  const mediaStream = mediaSources[prefix];
  const setStreamState = useSetMediaStream();

  const sourceRef = useRef<HTMLVideoElement>(null);

  const videoStyle: React.CSSProperties = useMemo(() => {
    return {
      opacity: mediaStream ? 1 : 0,
      height: "100%",
    };
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream.type !== "loaded") {
      return;
    }

    const track = mediaStream.stream.getVideoTracks()[0];
    if (!track) {
      return;
    }

    track.onended = () => {
      setStreamState(prefix, { type: "initial" });
    };
  }, [mediaStream, prefix, setStreamState]);

  useEffect(() => {
    if (mediaStream.type !== "loaded") {
      return;
    }

    return () => {
      if (recordAudio) {
        mediaStream.stream.getAudioTracks().forEach((track) => track.stop());
      }

      mediaStream.stream.getVideoTracks().forEach((track) => track.stop());
    };
  }, [mediaStream, recordAudio]);

  useEffect(() => {
    const { current } = sourceRef;
    if (!current) {
      return;
    }

    if (selectedVideoSource === null) {
      setStreamState(prefix, { type: "initial" });
      return;
    }

    setStreamState(prefix, { type: "loading" });

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

        videoTrack.addEventListener(
          "ended",
          () => {
            clear();
            setStreamState(prefix, { type: "initial" });
          },
          { once: true },
        );

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

        setStreamState(prefix, { type: "loaded", stream });
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

        setStreamState(prefix, {
          type: "error",
          error: errMessage,
        });
      });

    return () => {
      cleanup.forEach((f) => f());
    };
  }, [
    clear,
    preferPortrait,
    prefix,
    recordAudio,
    selectedAudioSource,
    selectedVideoSource,
    setResolution,
    setStreamState,
  ]);

  useEffect(() => {
    const { current } = sourceRef;

    if (!current) {
      return;
    }

    const onResize = () => {
      setResolution((r) => {
        if (r === null) {
          return null;
        }

        return {
          ...r,
          width: current.videoWidth,
          height: current.videoHeight,
        };
      });
    };

    current.addEventListener("resize", onResize);

    return () => {
      current.removeEventListener("resize", onResize);
    };
  }, [setResolution]);

  const onReset = useCallback(() => {
    setStreamState(prefix, {
      type: "initial",
    });
    clear();
  }, [clear, prefix, setStreamState]);

  return (
    <AbsoluteFill style={container} id={prefix + "-video-container"}>
      <video ref={sourceRef} muted style={videoStyle} />
      {mediaStream.type === "loading" ? <Spinner /> : null}
      {mediaStream.type === "error" ? (
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
          {mediaStream.error}
          <a className="underline cursor-pointer" onClick={onReset}>
            Try again
          </a>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
