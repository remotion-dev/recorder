import { PROCESS_VIDEOS } from "../../scripts/server/constants";

export const convertFilesInServer = async ({
  endDate,
  selectedFolder,
}: {
  endDate: number;
  selectedFolder: string;
}) => {
  const url = new URL(PROCESS_VIDEOS, window.location.origin);

  url.search = new URLSearchParams({
    folder: selectedFolder,
    endDateAsString: endDate.toString(),
  }).toString();

  const res = await fetch(url, {
    method: "POST",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }
};
