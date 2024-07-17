import { useState } from "react";

const useMUTData = () => {
  const [MFMUTItem, setMFMUTItem] = useState([]);
  return {
    MFMUTItem,
    setMFMUTItem,
  };
};

export default useMUTData;
