import { useEffect, useMemo, useState } from "react";

const GREEN = "#0b800b";
const YELLOW = "#bda615";
const RED = "#800b0b";

const container: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  alignItems: "center",
  flexDirection: "row",
};

const gradientStyle: React.CSSProperties = {
  display: "flex",
  backgroundImage: `linear-gradient(to right, ${GREEN}, ${GREEN} 66% , ${YELLOW} 66%, ${YELLOW} 90%, ${RED} 90%,${RED} )`,
  justifyContent: "flex-end",
  height: 4,
  flex: 1,
};

export const VolumeMeter: React.FC<{
  mediaStream: MediaStream | null;
}> = ({ mediaStream }) => {
  const [currentVolume, setCurrentVolume] = useState(0);

  useEffect(() => {
    const getVolume = () => {
      if (!mediaStream || mediaStream.getAudioTracks().length === 0) {
        return 0;
      }

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(mediaStream);
      const scriptProcessor = audioContext.createScriptProcessor(512, 1, 1); // (bufferSize, inputChannels, outputChannels).

      analyser.smoothingTimeConstant = 0.9;
      // An unsigned integer, representing the window size of the FFT, given in number of samples.
      // A higher value will result in more details in the frequency domain but fewer details in the amplitude domain.
      analyser.fftSize = 512; // fftSize 512 and minDecibels -123 seems to work pretty similar to OBS volume meter
      analyser.minDecibels = -123;
      analyser.maxDecibels = 0;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        // coppies frequency data into array. Frequency data is composed of integers between 0 and 255, representing the volume of each frequency.
        // Every item in the array represents the decibel value of a specific frequency.
        analyser.getByteFrequencyData(array);
        // get the sum of all decibel values of each frequency in the array
        const arraySum = array.reduce((a, value) => a + value, 0);
        let currentAverageVolume = 0;
        // get the average volume by dividing the sum by the number of items in the array
        currentAverageVolume = arraySum / array.length;
        // extra smoothing
        setCurrentVolume((old) => (old + currentAverageVolume) / 2);
      };
    };

    getVolume();
  }, [mediaStream]);

  const widthPercent = useMemo(() => {
    return currentVolume < 100 ? 100 - currentVolume : 0;
  }, [currentVolume]);

  const dynamicCover: React.CSSProperties = useMemo(() => {
    const widthPercentageString = widthPercent.toString() + "%";

    return {
      width: widthPercentageString,
      height: 4,
      backgroundColor: "#242424",
    };
  }, [widthPercent]);

  return (
    <div style={container}>
      <div style={gradientStyle}>
        <div style={dynamicCover} />
      </div>
    </div>
  );
};
