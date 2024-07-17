import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useBetween } from "use-between";
import useMasterMeter from "./MasterMeterData";

function MasterMeterComponent() {
  const { MMitem, MMsetItems } = useBetween(useMasterMeter);

  const sumOfStandardVolumeFlowRate = MMitem.reduce(
    (total, d) => total + d.StandardVolumeFlowRate,
    0
  );

  const averageOfStandardVolumeFlowRate =
    sumOfStandardVolumeFlowRate / MMitem.length;

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      console.log(d);
      MMsetItems(d);
    });
  };

  return (
    <div className="master-meter">
      <h1> Master Meter</h1>

      <div className="choose-data">
        <label className="custom-file-upload">
          <h2> Select Excel Data</h2>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
          />
        </label>
      </div>

      <div className="table-style">
        {MMitem.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                {Object.keys(MMitem[0]).map((key) => (
                  <th key={key}> {key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MMitem.map((d) => (
                <tr key={d.Item}>
                  <td>{d.Timestamp}</td>
                  <td>{d.Pressure.toFixed(3)}</td>
                  <td>{d.Temperature.toFixed(3)}</td>
                  <td>{d.LineDensity}</td>
                  <td>{d.BaseDensity}</td>
                  <td>{d.MeterFreq.toFixed(3)}</td>
                  <td>{d.MeterPulse.toFixed(3)}</td>
                  <td>{d.VolumeFlowRate.toFixed(3)}</td>
                  <td>{d.StandardVolumeFlowRate.toFixed(3)}</td>
                  <td>{d.MassFlowRate.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="data-information">
        <h3>
          Mean of Standard Volume Flow Rate:{" "}
          {averageOfStandardVolumeFlowRate.toFixed(3)} m3/hour
        </h3>
        <h3>Data Length: {MMitem.length}</h3>
      </div>
    </div>
  );
}

export default MasterMeterComponent;
