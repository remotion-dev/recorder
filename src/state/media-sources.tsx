import React, { useCallback, useMemo, useState } from "react";
import { Prefix } from "../helpers/prefixes";

export type StreamState =
  | { type: "initial" }
  | { type: "loading" }
  | { type: "loaded"; stream: MediaStream }
  | { type: "error"; error: string };

export type MediaSources = {
  [key in Prefix]: StreamState;
};

export type MediaSourcesContextType = {
  mediaSources: MediaSources;
  setMediaStream: (prefix: Prefix, source: StreamState) => void;
};

const MediaSourcesContext = React.createContext<MediaSourcesContextType | null>(
  null,
);

export const MediaSourcesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mediaSources, setMediaSources] = useState<MediaSources>({
    alternative1: { type: "initial" },
    alternative2: { type: "initial" },
    display: { type: "initial" },
    webcam: { type: "initial" },
  });

  const setMediaStream = useCallback(
    (prefix: Prefix, source: StreamState | null) => {
      setMediaSources((prevMediaSources) => ({
        ...prevMediaSources,
        [prefix]: source,
      }));
    },
    [],
  );

  const value: MediaSourcesContextType = useMemo(
    () => ({ mediaSources, setMediaStream }),
    [mediaSources, setMediaStream],
  );

  return (
    <MediaSourcesContext.Provider value={value}>
      {children}
    </MediaSourcesContext.Provider>
  );
};

export const useMediaSources = () => {
  const context = React.useContext(MediaSourcesContext);
  if (!context) {
    throw new Error(
      "useMediaSources must be used within a MediaSourcesProvider",
    );
  }

  return context.mediaSources;
};

export const useSetMediaStream = () => {
  const context = React.useContext(MediaSourcesContext);
  if (!context) {
    throw new Error(
      "useSetMediaStream must be used within a MediaSourcesProvider",
    );
  }

  return context.setMediaStream;
};
