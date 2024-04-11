export const downloadVideo = (data: Blob, endDate: number, prefix: string) => {
  let webcamchunks: Blob[] = [];
  if (data.size > 0) {
    webcamchunks.push(data);
  }

  const blob = new Blob(webcamchunks);

  const link = document.createElement("a");
  const blobUrl = URL.createObjectURL(blob);
  link.href = blobUrl;
  link.download = `${prefix}${endDate}.webm`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
  webcamchunks = [];
};

export const handleUploadFile = async (
  data: Blob,
  endDate: number,
  prefix: string,
) => {
  const videoFile = new File([data], "video.webm", { type: data.type });
  const fileName = prefix + endDate.toString() + ".webm";
  console.log(fileName);

  const url = new URL(`/api/upload-video`, window.location.origin);

  url.search = new URLSearchParams({
    folder: "hello",
    file: fileName,
  }).toString();

  // might add query params to define name & folder
  const res = await fetch(url, {
    method: "POST",
    body: videoFile,
  });

  console.log(res.status);
};
