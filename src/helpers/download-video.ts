import { ProcessStatus } from "../components/ProcessingStatus";
import { convertInBrowser } from "./convert-in-browser";
import { formatMilliseconds } from "./format-time";

export const downloadVideo = async ({
  data,
  endDate,
  prefix,
  setStatus,
}: {
  data: Blob;
  endDate: number;
  prefix: string;
  setStatus: React.Dispatch<React.SetStateAction<ProcessStatus | null>>;
}) => {
  const webcamchunks: Blob[] = [];
  if (data.size > 0) {
    webcamchunks.push(data);
  }

  const result = await convertInBrowser({
    src: data,
    onProgress: ({ millisecondsWritten }) => {
      setStatus({
        title: `Converting ${prefix}${endDate}.webm`,
        description: `${formatMilliseconds(millisecondsWritten)} processed`,
      });
    },
  });

  const saved = await result.save();

  const link = document.createElement("a");
  const blobUrl = URL.createObjectURL(saved);
  link.href = blobUrl;
  link.download = `${prefix}${endDate}.webm`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
  setStatus(null);
};
