import React, { useState } from "react";
import useMMData from "./MMData";
import useMUTData from "./MUTData";
import * as XLSX from "xlsx";
import { useBetween } from "use-between";
import { motokoV3_backend } from "../../../declarations/motokoV3_backend";

function MeterFactorCalculation() {
  const [MMitem, setMMItems] = useState("");
  const [MUTitem, setMUTItems] = useState("");
  const { MFMMitem, setMFMMItem } = useBetween(useMMData);
  const { MFMUTItem, setMFMUTItem } = useBetween(useMUTData);
  const [response, setResponse] = useState("");

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
      setMMItems(d);
      setMFMMItem(d);
    });
  };
  const sumMM = MFMMitem.reduce((totalmm, d) => totalmm + d.actual_MM, 0);
  const avgMM = sumMM / MFMMitem.length;

  const sumMUT = MFMUTItem.reduce(
    (totalmut, dt) => totalmut + dt.actual_MUT,
    0
  );
  const avgMUT = sumMUT / MFMUTItem.length;

  const MFActual = avgMM / avgMUT;

  const sumPredMM = MFMMitem.reduce(
    (totalPredMM, dp) => totalPredMM + dp.predicted_MM,
    0
  );
  const avgPredMM = sumPredMM / MFMMitem.length;

  const sumPredMUT = MFMUTItem.reduce(
    (totalPredMUT, dpt) => totalPredMUT + dpt.predicted_MUT,
    0
  );
  const avgPredMUT = sumPredMUT / MFMUTItem.length;

  const MFPredicted = avgPredMM / avgMUT;

  const readExcelMUT = (fileMUT) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileMUT);

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

    promise.then((dt) => {
      setMUTItems(dt);
      setMFMUTItem(dt);
    });
  };

  const handleButton = async (e) => {
    e.preventDefault();
    try {
      const res = await motokoV3_backend.addMFDetails(
        avgMM,
        avgMUT,
        MFActual,
        avgPredMM,
        avgPredMUT,
        MFPredicted
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
    <div className="mf-calc-container">
      <div className="mf-excels">
        <div className="mf-excel">
          <div className="mm-upload">
            <label className="file-upload">
              <h3> Select Master Meter</h3>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
              />
            </label>
          </div>
          <div className="mf-data">
            {MMitem.length > 0 && (
              <table className="mf-table">
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
                      <td>{d.actual_MM.toFixed(4)}</td>
                      <td>{d.predicted_MM.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="mf-excel">
          <div className="mut-upload">
            <label className="file-upload">
              <h3> Select Meter Under Test</h3>
              <input
                type="file"
                onChange={(e) => {
                  const fileMUT = e.target.files[0];
                  readExcelMUT(fileMUT);
                }}
              />
            </label>
          </div>
          <div className="mf-data">
            {MUTitem.length > 0 && (
              <table className="mf-table">
                <thead>
                  <tr>
                    {Object.keys(MUTitem[0]).map((key) => (
                      <th key={key}> {key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MUTitem.map((dt) => (
                    <tr key={dt.Item}>
                      <td>{dt.actual_MUT.toFixed(4)}</td>
                      <td>{dt.predicted_MUT.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className="mf-display">
        <div className="display">
          <div className="item-1">
            <div className="data-key">
              <p>Average Actual MM Flow Rate</p>
            </div>
            <div className="data-value">
              <h3> {avgMM.toFixed(4)} m3/hour </h3>
            </div>
          </div>
          <div className="item-1">
            <div className="data-key">
              <p>Average Actual MUT Flow Rate</p>
            </div>
            <div className="data-value">
              <h3> {avgMUT.toFixed(4)} m3/hour</h3>
            </div>
          </div>
          <div className="item-1">
            <div className="data-key">
              <h3> Actual Meter Factor</h3>
            </div>
            <div className="data-value">
              <h3> {MFActual.toFixed(4)}</h3>
            </div>
          </div>
        </div>
        <div className="display">
          <div className="item-1">
            <div className="data-key">
              <p>Average Predicted MM Flow Rate</p>
            </div>
            <div className="data-value">
              <h3> {avgPredMM.toFixed(4)} m3/hour</h3>
            </div>
          </div>
          <div className="item-1">
            <div className="data-key">
              <p>Average Predicted MUT Flow Rate</p>
            </div>
            <div className="data-value">
              <h3> {avgPredMUT.toFixed(4)} m3/hour</h3>
            </div>
          </div>
          <div className="item-1">
            <div className="data-key">
              <h3> Predicted Meter Factor</h3>
            </div>
            <div className="data-value">
              <h3> {MFPredicted.toFixed(4)}</h3>
            </div>
          </div>
        </div>

        <div className="mf-btn-container">
          <button className="mf-btn" onClick={handleButton}>
            Send To Blockchain Network
          </button>
          <button className="mf-btn" onClick={getProof}>
            Get proof
          </button>
        </div>
        <h3>{response}</h3>
      </div>
    </div>
  );
}

export default MeterFactorCalculation;
