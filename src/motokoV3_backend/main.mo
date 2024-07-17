import Float "mo:base/Float";
import Principal "mo:base/Principal";

actor SendDataToBlockchain {
  stable var avgMUT : Float = 0;
  stable var avgMM : Float = 0;
  stable var meterFactor : Float = 0;
  stable var meterFactorError : Float = 0;

  stable var avgActMM : Float = 0;
  stable var avgActMUT : Float = 0;
  stable var actMF : Float = 0;

  stable var avgPredMM : Float = 0;
  stable var avgPredMUT : Float = 0;
  stable var predMF : Float = 0;

  // Update function - goes through consensus
  public shared (_) func addDataDetails(mutAvg : Float, mmAvg : Float, factorMeter : Float, errorFactorMeter : Float) : async Text {
    avgMUT := mutAvg;
    avgMM := mmAvg;
    meterFactor := factorMeter;
    meterFactorError := errorFactorMeter;
    return "Data Details Sent to Blockchain Network!";
  };

  // Update function
  public shared (_) func addMFDetails(actMMAvg : Float, actMUTAvg : Float, mfAct : Float, predMMAvg : Float, predMUTAvg : Float, mfPred : Float) : async Text {
    avgActMM := actMMAvg;
    avgActMUT := actMUTAvg;
    actMF := mfAct;
    avgPredMM := predMMAvg;
    avgPredMUT := predMUTAvg;
    predMF := mfPred;
    return "Meter Factor Details Sent to Blockchain Network!";
  };

  // Read only - does not go through consensus
  public query func getAvgMUT() : async Float {
    return avgMUT;
  };

  public query func getAvgMM() : async Float {
    return avgMM;
  };

  public query func getMeterFactor() : async Float {
    return meterFactor;
  };

  public query func getMeterFactorError() : async Float {
    return meterFactorError;
  };

  public query func getActMM() : async Float {
    return avgActMM;
  };

  public query func getActMUT() : async Float {
    return avgActMUT;
  };

  public query func getActMF() : async Float {
    return actMF;
  };

  public query func getPredMM() : async Float {
    return avgPredMM;
  };

  public query func getPredMUT() : async Float {
    return avgPredMUT;
  };

  public query func getPredMF() : async Float {
    return predMF;
  };

  public func getWhoAmI() : async Text {
    let self = Principal.fromActor(SendDataToBlockchain);
    return Principal.toText(self);
  };

};
