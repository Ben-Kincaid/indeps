import React, { useEffect, useMemo, useRef, useState } from "react";

const useElementSize = (): [
  React.RefObject<HTMLDivElement>,
  { width?: number; height?: number }
] => {
  const elRef = useRef<HTMLDivElement>(null);
  const [elWidth, setElWidth] = useState<number | undefined>();
  const [elHeight, setElHeight] = useState<number | undefined>();

  const dimensions = useMemo(
    () => ({
      width: elWidth,
      height: elHeight
    }),
    [elWidth, elHeight]
  );

  useEffect(() => {
    if (!elRef.current) return undefined;

    const ro = new ResizeObserver(([entry]) => {
      setElWidth(entry.contentRect.width);
      setElHeight(entry.contentRect.height);
    });

    ro.observe(elRef.current);

    return () => {
      ro.disconnect();
    };
  }, []);

  return [elRef, dimensions];
};

export default useElementSize;
