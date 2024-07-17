import { useState } from "react";

const useMasterMeter = () => {
  const [MMitem, MMsetItems] = useState([]);
  return {
    MMitem,
    MMsetItems,
  };
};

export default useMasterMeter;
