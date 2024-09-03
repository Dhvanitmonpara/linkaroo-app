import "./Stepper.css";

type StepperProps = {
  stepIndex: number;
  className?: string;
};

const Stepper = ({ stepIndex, className }: StepperProps) => {
  const steps = ["w-1/3", "w-2/3", "w-full"];
  const step = steps[stepIndex];
  return (
    <div className={`w-full h-1 ${className}`}>
      <div className={`${step} h-full bg-green-400`}></div>
    </div>
  );
};

export default Stepper;
