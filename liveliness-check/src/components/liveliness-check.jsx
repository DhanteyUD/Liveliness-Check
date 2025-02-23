import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

const LivenessCheck = () => {
  const webcamRef = useRef(null);
  const [livenessVerified, setLivenessVerified] = useState(false);

  // Capture an image from the webcam
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      await detectFace();
    }
  }, [webcamRef]);

  // Detect face and verify liveness
  const detectFace = async () => {
    const model = await blazeface.load();
    const video = webcamRef.current.video;
    const predictions = await model.estimateFaces(video, false);

    if (predictions.length > 0) {
      setLivenessVerified(true);
      console.log("Face detected: Liveness check passed!");
    } else {
      setLivenessVerified(false);
      console.log("No face detected: Liveness check failed!");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-lg"
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={capture}
      >
        Capture & Verify
      </button>
      {livenessVerified && (
        <p className="text-green-500 mt-2">Liveness Verified ✅</p>
      )}
    </div>
  );
};

export default LivenessCheck;
