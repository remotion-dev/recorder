import { useCallback, useEffect, useMemo, useState } from "react";

export type Size = {
  width: number;
  height: number;
  left: number;
  top: number;
};

// If a pane has been moved, it will cause a layout shift without
// the window having been resized. Those UI elements can call this API to
// force an update

type ElementSizeForceUpdate = () => void;

let elementSizeHooks: ElementSizeForceUpdate[] = [];

export const updateAllElementsSizes = () => {
  for (const listener of elementSizeHooks) {
    listener();
  }
};

export const useElementSize = (
  ref: React.RefObject<HTMLElement>,
): Size | null => {
  const [size, setSize] = useState<Size | null>(() => {
    if (!ref.current) {
      return null;
    }

    const [rect] = ref.current.getClientRects();

    return rect ?? null;
  });

  const observer = useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }

    return new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      // The contentRect returns the width without any `scale()`'s being applied. The height is wrong
      const { target } = entry;
      console.log({ entry });
      // The clientRect returns the size with `scale()` being applied.
      const [newSize] = target.getClientRects();

      if (!newSize) {
        setSize(null);
        return;
      }

      setSize(newSize);
    });
  }, []);

  const updateSize = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const [rect] = ref.current.getClientRects();

    if (!rect) {
      setSize(null);
      return;
    }

    setSize((prevState) => {
      const isSame =
        prevState &&
        prevState.width === rect.width &&
        prevState.height === rect.height &&
        prevState.left === rect.x &&
        prevState.top === rect.y;

      if (isSame) {
        return prevState;
      }

      return rect;
    });
  }, [ref]);

  useEffect(() => {
    if (!observer) {
      return;
    }

    const { current } = ref;
    if (ref.current) {
      observer.observe(ref.current);
    }

    return (): void => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [observer, ref, updateSize]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [updateSize]);

  useEffect(() => {
    elementSizeHooks.push(updateSize);

    return () => {
      elementSizeHooks = elementSizeHooks.filter((e) => e !== updateSize);
    };
  }, [updateSize]);

  return size;
};
