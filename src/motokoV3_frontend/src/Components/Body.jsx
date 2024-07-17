import React from "react";
import MasterMeterComponent from "./MasterMeterComponent";
import MeterUnderTestComponent from "./MeterUnderTestComponent";
import DataProcessing from "./DataProcessing";
import MeterFactorCalculation from "./MeterFactorCalculation";

function Body() {
  return (
    <>
      <div className="body">
        <div className="excel-components">
          <MasterMeterComponent></MasterMeterComponent>
          <MeterUnderTestComponent></MeterUnderTestComponent>
        </div>
      </div>
      <div className="data-processing">
        <DataProcessing></DataProcessing>
      </div>
      <div className="meter-factor-calculation">
        <MeterFactorCalculation></MeterFactorCalculation>
      </div>
    </>
  );
}

export default Body;
