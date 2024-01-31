import { useCallback, useEffect, useState } from "react";

const rectangleStyle: React.CSSProperties = {
  width: 28,
  height: 10,
  border: "1px solid white",
};

export const VolumeMeter: React.FC<{ mediaStream: MediaStream | null }> = ({
  mediaStream,
}) => {
  const [currentVolume, setCurrentVolume] = useState(0);

  useEffect(() => {
    const getVolume = () => {
      if (!mediaStream) {
        return 0;
      }

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(mediaStream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      let currentAverageVolume = 0;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        currentAverageVolume = arraySum / array.length;
        console.log(currentAverageVolume);
        setCurrentVolume(currentAverageVolume);
      };
    };

    getVolume();
  }, [mediaStream]);

  const getBackgroundForThreshold = useCallback(
    (threshold: number): React.CSSProperties => {
      return {
        ...rectangleStyle,
        backgroundColor: currentVolume > threshold ? "green" : "transparent",
      };
    },
    [currentVolume],
  );

  const firstFill = getBackgroundForThreshold(5);
  const secondFill = getBackgroundForThreshold(20);
  const thirdFill = getBackgroundForThreshold(40);
  const fourthFill = getBackgroundForThreshold(60);
  const fifthFill = getBackgroundForThreshold(80);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
      <div style={{ ...firstFill }} />
      <div style={{ width: 20, height: 6, ...secondFill }} />
      <div style={{ width: 20, height: 6, ...thirdFill }} />
      <div style={{ width: 20, height: 6, ...fourthFill }} />
      <div style={{ width: 20, height: 6, ...fifthFill }} />
    </div>
  );
};
