import React, { useEffect } from "react";

const Viewer = () => {
  useEffect(() => {
    const lockData = (window as any).lockData;
    console.log({ lockData });
  }, []);

  return (
    <div>
      <p>Viewer rendered.</p>
    </div>
  );
};

export default Viewer;
