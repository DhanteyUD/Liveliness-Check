/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import {
  showToastError,
  showToastInfo,
  showToastWarning,
} from "../helpers/toast";
import { Button } from "./button";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import livelinessImage from "../assets/liveliness-check.png";

function LivelinessCheck({
  completedLiveliness,
  setShowLivelinessCheck,
  setCompletedLiveliness,
}) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const step1Completed = useRef(false);
  const step2Completed = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    requestCameraAccess();
    loadModels();
    selectRandomActions();
  }, []);

  useEffect(() => {
    if (selectedActions.length) {
      detectLiveliness();
    }
  }, [selectedActions]);

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.onloadedmetadata = () => {
          webcamRef.current.play();
          showToastInfo("Camera started");
        };
      }
    } catch (err) {
      showToastError(err);
      alert("Please allow camera access to proceed.");
    }
  };

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      setLoading(false);
      setIsDetecting(true);
    } catch (error) {
      showToastError(error);
    }
  };

  const selectRandomActions = () => {
    const actions = [
      "Kindly tilt your head",
      "Kindly open your mouth",
      "Kindly nod your head",
      "Kindly blink your eyes",
    ];
    const shuffled = actions.sort(() => 0.5 - Math.random());
    setSelectedActions([shuffled[0], shuffled[1]]);
  };

  const detectLiveliness = async () => {
    let prevJawY = null;
    let blinkCount = 0;

    const interval = setInterval(async () => {
      if (!webcamRef.current || !webcamRef.current.video) {
        showToastWarning("Camera initialization in progress...");
        return;
      }

      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 128,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks();

      if (!detections) {
        setIsFaceDetected(false);
        showToastWarning(
          "Try moving closer to the camera and ensure your face is well lit."
        );
        return;
      }

      setIsFaceDetected(true);
      const landmarks = detections.landmarks;

      //* Tilt Head Detection:
      const nose = landmarks.getNose();
      const headTilted = Math.abs(nose[0]._x - nose[2]._x) > 10;

      //* Open Mouth Detection:
      const mouth = landmarks.getMouth();
      const upperLipY = mouth[13]._y;
      const lowerLipY = mouth[17]._y;
      const mouthOpenness = Math.abs(lowerLipY - upperLipY);
      const mouthOpen = mouthOpenness > 10;

      //* Nod Detection:
      const jaw = landmarks.getJawOutline();
      const jawY = jaw[8]._y;
      let nodded = false;
      if (prevJawY !== null && Math.abs(jawY - prevJawY) > 10) {
        nodded = true;
      }
      prevJawY = jawY;

      //* Blink Eye Detection:
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();

      const eyeAspectRatio = (eye) => {
        const width = Math.hypot(eye[3]._x - eye[0]._x, eye[3]._y - eye[0]._y);
        const height =
          (Math.hypot(eye[1]._x - eye[5]._x, eye[2]._x - eye[4]._x) +
            Math.hypot(eye[1]._y - eye[5]._y, eye[2]._y - eye[4]._y)) /
          2;
        return height / width;
      };

      const leftEAR = eyeAspectRatio(leftEye);
      const rightEAR = eyeAspectRatio(rightEye);
      const avgEAR = (leftEAR + rightEAR) / 2;

      const BLINK_THRESHOLD = 0.25;
      if (avgEAR < BLINK_THRESHOLD) {
        blinkCount++;
      }

      // Step Verification:
      if (!step1Completed.current) {
        if (
          (selectedActions[0] === "Kindly tilt your head" && headTilted) ||
          (selectedActions[0] === "Kindly open your mouth" && mouthOpen) ||
          (selectedActions[0] === "Kindly nod your head" && nodded) ||
          (selectedActions[0] === "Kindly blink your eyes" && blinkCount >= 1)
        ) {
          step1Completed.current = true;
          setCurrentStep(1);
        }
      } else if (!step2Completed.current) {
        if (
          (selectedActions[1] === "Kindly tilt your head" && headTilted) ||
          (selectedActions[1] === "Kindly open your mouth" && mouthOpen) ||
          (selectedActions[1] === "Kindly nod your head" && nodded) ||
          (selectedActions[1] === "Kindly blink your eyes" && blinkCount >= 2)
        ) {
          step2Completed.current = true;
          setCurrentStep(2);

          setIsVerified(true);
          setCompletedLiveliness(true);
          setIsDetecting(false);

          clearInterval(interval);
        }
      }
    }, 200);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 py-5 px-2">
        <img
          src={livelinessImage}
          alt="liveliness check"
          className="w-[200px]"
        />
        <p className="animate-pulse text-[13px] text-[#002564] font-[600] ">
          Loading face recognition models...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-[200px] pt-2 pb-5 flex flex-col items-center gap-5 justify-center">
        {!isVerified ? (
          <p className="text-[#528DC2] font-[600]">
            {currentStep === 0
              ? selectedActions[0]
              : currentStep === 1
              ? selectedActions[1]
              : ""}
          </p>
        ) : (
          <p className="text-[#41b047] font-[600]">Check Completed!</p>
        )}
      </div>

      <div
        className={`relative w-[300px] h-[300px] rounded-full overflow-hidden flex justify-center items-center border-4 border-b-transparent ${
          !isFaceDetected
            ? "border-[#FF3B30]"
            : isFaceDetected || isVerified
            ? "border-[#41b047]"
            : "border-gray-400 animate-glow"
        }`}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={300}
          height={300}
          videoConstraints={{
            facingMode: "user",
          }}
          className="w-[280px] h-[280px] border border-gray-400 rounded-full object-cover"
        />
      </div>

      <div className="relative min-h-[60px] w-[200px] mt-2 flex flex-col items-center gap-10 justify-between">
        <div className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep > 0 || isVerified ? "bg-[#41b047]" : "bg-[#ccc]"
            }`}
          >
            <p className="text-white text-[12px] font-[600]">
              {currentStep > 0 || isVerified ? (
                <FiCheck className="text-[14px]" />
              ) : (
                "1"
              )}
            </p>
          </div>

          <div
            className={`w-8 h-[1px] mx-[2px] ${
              currentStep > 0 || isVerified ? "bg-[#6aea70]" : "bg-[#ccc]"
            }`}
          ></div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isVerified ? "bg-[#41b047]" : "bg-[#ccc]"
            }`}
          >
            <p className="text-white text-[12px] font-[600]">
              {isVerified ? <FiCheck className="text-[14px]" /> : "2"}
            </p>
          </div>
        </div>

        {isDetecting &&
        !isFaceDetected &&
        !isVerified &&
        !completedLiveliness ? (
          <div className="absolute bottom-[0] w-[400px] flex flex-col items-center justify-center text-center">
            <p className="text-[#FF3B30] font-[600] text-[13px]">
              Please move your face into the frame
            </p>
          </div>
        ) : null}

        {isVerified && completedLiveliness ? (
          <Button onClick={() => setShowLivelinessCheck(false)}>
            Continue
          </Button>
        ) : null}
      </div>
    </div>
  );
}

LivelinessCheck.propTypes = {
  completedLiveliness: PropTypes.bool.isRequired,
  setShowLivelinessCheck: PropTypes.func.isRequired,
  setCompletedLiveliness: PropTypes.func.isRequired,
};

export default LivelinessCheck;
