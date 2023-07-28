import { webmFixDuration } from "webm-fix-duration";

export const onVideo = (
  data: Blob,
  duration: number,
  endDate: number,
  prefix: string
) => {
  let webcamchunks: Blob[] = [];

  if (data.size > 0) {
    webcamchunks.push(data);
  }

  const blob = new Blob(webcamchunks);

  const link = document.createElement("a");
  webmFixDuration(blob, duration).then((fixedBlob) => {
    const blobUrl = URL.createObjectURL(fixedBlob);
    link.href = blobUrl;
    link.download = `${prefix}${endDate}.webm`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
    webcamchunks = [];
  });
};
