import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useBetween } from "use-between";
import useMeterUnderTest from "./MeterUnderTestData";

function MeterUnderTestComponent() {
  const { MUTitem, MUTsetItems } = useBetween(useMeterUnderTest);

  const sumOfStandardVolumeFlowRate = MUTitem.reduce(
    (total, d) => total + d.StandardVolumeFlowRate,
    0
  );

  const averageOfStandardVolumeFlowRate =
    sumOfStandardVolumeFlowRate / MUTitem.length;

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        console.log(bufferArray);

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        console.log(wb);

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
        console.log(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      console.log(d);
      MUTsetItems(d);
    });
  };

  return (
    <div className="meter-under-test">
      <h1> Meter Under Test</h1>
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
        {MUTitem.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                {Object.keys(MUTitem[0]).map((key) => (
                  <th key={key}> {key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MUTitem.map((d) => (
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
          Mean of Standard Volume Flow Rate:
          {averageOfStandardVolumeFlowRate.toFixed(3)} m3/hour
        </h3>
        <h3>Data Length: {MUTitem.length}</h3>
      </div>
    </div>
  );
}

export default MeterUnderTestComponent;
