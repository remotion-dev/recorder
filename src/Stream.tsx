import type { Dimensions } from "@remotion/layout-utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Spinner } from "./components/Spinner";
import type { SelectedSource } from "./helpers/get-selected-video-source";
import { getVideoStream } from "./helpers/get-video-stream";
import { Prefix } from "./helpers/prefixes";

const container: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
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

export const Stream: React.FC<{
  prefix: Prefix;
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  setResolution: React.Dispatch<React.SetStateAction<Dimensions | null>>;
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
  ]);

  const onLoadedMetadata = useCallback(() => {
    setResolution({
      width: sourceRef.current?.videoWidth as number,
      height: sourceRef.current?.videoHeight as number,
    });
  }, [setResolution]);

  return (
    <div style={container} id={prefix + "-video-container"}>
      <video
        ref={sourceRef}
        muted
        style={videoStyle}
        onLoadedMetadata={onLoadedMetadata}
      />
      {streamState === "loading" ? <Spinner /> : null}
    </div>
  );
};
