import { useEffect, useState } from "react";
import { canUseWebFsWriter } from "../helpers/browser-support";

export const EnsureBrowserSupport: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canUseWebFs, setCanUseWebFsWriter] = useState<boolean | null>(null);
  useEffect(() => {
    canUseWebFsWriter().then(setCanUseWebFsWriter);
  }, []);

  if (canUseWebFs === null) {
    return null;
  }

  if (!canUseWebFs) {
    return (
      <div className="justify-center text-white flex items-center flex-col absolute inset-0  text-sm">
        <strong>Browser not supported</strong>
        <p className="max-w-[500px] text-center text-balance">
          Your browser does not support the Web FS API which is needed to use
          this application. Please use a different browser.
        </p>
      </div>
    );
  }

  return children;
};
