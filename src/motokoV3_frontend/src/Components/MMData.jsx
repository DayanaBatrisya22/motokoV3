import { useState } from "react";

const useMMData = () => {
  const [MFMMitem, setMFMMItem] = useState([]);
  return {
    MFMMitem,
    setMFMMItem,
  };
};

export default useMMData;
