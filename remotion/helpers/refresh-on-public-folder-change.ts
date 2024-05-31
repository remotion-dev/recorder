import {
  getStaticFiles,
  reevaluateComposition,
  watchPublicFolder,
} from "@remotion/studio";
import { useEffect, useState } from "react";
import { StaticFile } from "remotion";

const filterForCurrentComposition = (
  files: StaticFile[],
  compositionId: string,
) => {
  return files.filter((f) => {
    return f.name.startsWith(compositionId + "/");
  });
};

export const useRefreshOnPublicFolderChange = (compositionId: string) => {
  const [staticFiles, setStaticFiles] = useState(() =>
    filterForCurrentComposition(getStaticFiles(), compositionId),
  );

  useEffect(() => {
    const { cancel } = watchPublicFolder(() => {
      const newStaticFiles = filterForCurrentComposition(
        getStaticFiles(),
        compositionId,
      );

      if (JSON.stringify(newStaticFiles) === JSON.stringify(staticFiles)) {
        return;
      }

      setStaticFiles(newStaticFiles);
      reevaluateComposition();
    });

    return () => {
      cancel();
    };
  }, [compositionId, staticFiles]);
};
