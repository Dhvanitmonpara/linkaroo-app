import { useState } from "react";
import "./Stepper.css";
import { TiTick } from "react-icons/ti";

const Stepper = () => {

  const steps = ["Email signup", "Profile setup", "Email verification"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  return (
    <>
      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>
      {!complete && (
        <button
          className="btn text-white"
          onClick={() => {
            currentStep === steps.length
              ? setComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? "Finish" : "Next"}
        </button>
      )}
      {!complete && (
        <button
          className="btn text-white"
          onClick={() => {
            currentStep === 1
              ? ""
              : setCurrentStep((prev) => prev - 1);
          }}
        >
          Back
        </button>
      )}
    </>
  );
};

export default Stepper;