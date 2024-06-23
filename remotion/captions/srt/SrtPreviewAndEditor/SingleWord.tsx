import React, { useCallback, useMemo, useState } from "react";
import { Word } from "../../../../config/autocorrect";
import { useCaptionOverlay } from "../../editor/use-caption-overlay";

export const SrtSingleWord: React.FC<{
  word: Word;
}> = ({ word }) => {
  const overlay = useCaptionOverlay();

  const [hovered, setHovered] = useState(false);

  const onPointerEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const style: React.CSSProperties = useMemo(() => {
    return {
      cursor: "pointer",
      color: hovered ? "gray" : "inherit",
    };
  }, [hovered]);

  const onClick = useCallback(() => {
    overlay.setOpen(word);
  }, [overlay, word]);

  return (
    <span
      style={style}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      {word.text}
    </span>
  );
};
