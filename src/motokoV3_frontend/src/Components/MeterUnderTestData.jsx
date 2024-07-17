import { useState } from "react";

const useMeterUnderTest = () => {
  const [MUTitem, MUTsetItems] = useState([]);
  return {
    MUTitem,
    MUTsetItems,
  };
};

export default useMeterUnderTest;
