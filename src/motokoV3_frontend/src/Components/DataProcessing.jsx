import React, { useState } from "react";
import { useBetween } from "use-between";
import useMasterMeter from "./MasterMeterData";
import useMeterUnderTest from "./MeterUnderTestData";
import { motokoV3_backend } from "../../../declarations/motokoV3_backend";

const DataProcessing = () => {
  const { MMitem } = useBetween(useMasterMeter);
  const { MUTitem } = useBetween(useMeterUnderTest);
  const [response, setResponse] = useState("");

  const sumMM = MMitem.reduce(
    (total, d) => total + d.StandardVolumeFlowRate,
    0
  );
  const averageMM = sumMM / MMitem.length;

  const sumMUT = MUTitem.reduce(
    (total, d) => total + d.StandardVolumeFlowRate,
    0
  );
  const averageMUT = sumMUT / MUTitem.length;

  const MF = averageMM / averageMUT;
  const MFError = MF - 1;

  const handleButton = async (e) => {
    e.preventDefault();
    try {
      const res = await motokoV3_backend.addDataDetails(
        averageMUT,
        averageMM,
        MF,
        MFError
      );
      setResponse(res);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const getProof = async (e) => {
    e.preventDefault();
    const canisterID = await motokoV3_backend.getWhoAmI();
    let URL = `https://dashboard.internetcomputer.org/canister/${canisterID}`;
    window.open(URL, "_blank");
  };

  return (
    <div className="processed-data-items">
      <div className="item-1">
        <div className="data-key">
          <hr></hr> <h2> Average Meter Under Test Flow Rate: </h2>
        </div>
        <div className="data-value">
          <hr></hr> <h3> {averageMUT.toFixed(3)} m3/hour</h3>
        </div>
      </div>

      <div className="item-1">
        <div className="data-key">
          {" "}
          <hr /> <h2> Average Master Meter Flow Rate: </h2>
        </div>
        <div className="data-value">
          {" "}
          <hr />
          <h3> {averageMM.toFixed(3)} m3/hour</h3>
        </div>
      </div>

      <div className="item-1">
        <div className="data-key">
          {" "}
          <hr />
          <h2> Meter Factor: </h2>
        </div>
        <div className="data-value">
          {" "}
          <hr />
          <h3> {MF.toFixed(3)}</h3>
        </div>
      </div>

      <div className="item-1">
        <div className="data-key">
          {" "}
          <hr />
          <h2> Meter Factor Error: </h2>
        </div>
        <div className="data-value">
          {" "}
          <hr />
          <h3> {MFError.toFixed(3)}</h3>
        </div>
      </div>
      <div className="item-1">
        <div className="motoko-btn-container">
          <button className="motoko-btn" onClick={handleButton}>
            Send To Blockchain Network
          </button>
          <h3>{response}</h3>

          <button className="motoko-btn" onClick={getProof}>
            Get proof
          </button>
        </div>
      </div>
    </div>
  );
};
export default DataProcessing;
