import { useState } from "react";

interface SignupStep {
  title: string;
  component: JSX.Element;
}

interface StepProps {
  next: () => void;
  back: () => void;
  stepIndex: number;
  totalSteps: number;
}

// Individual steps
const StepOne: React.FC<StepProps> = ({ next }) => (
  <div>
    <h2>Welcome! Let's Get Started</h2>
    <p>To join our affiliate program, please provide your basic information.</p>
    <button onClick={next}>Next</button>
  </div>
);

const StepTwo: React.FC<StepProps> = ({ next, back }) => (
  <div>
    <h2>More About You</h2>
    <p>Tell us about your platform and audience.</p>
    <button onClick={back}>Back</button>
    <button onClick={next}>Next</button>
  </div>
);

const StepThree: React.FC<StepProps & { onSuccess: () => void }> = ({ back, onSuccess }) => (
  <div>
    <h2>Finalize Registration</h2>
    <p>Please review your information and submit your application.</p>
    <button onClick={back}>Back</button>
    <button onClick={onSuccess}>Submit</button>
  </div>
);

interface AffiliateSignupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AffiliateSignupModal({ onClose, onSuccess }: AffiliateSignupModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: SignupStep[] = [
    { title: "Step 1", component: <StepOne next={() => goToNextStep()} back={() => goToPreviousStep()} stepIndex={0} totalSteps={3}/> },
    { title: "Step 2", component: <StepTwo next={() => goToNextStep()} back={() => goToPreviousStep()} stepIndex={1} totalSteps={3}/> },
    { title: "Step 3", component: <StepThree back={() => goToPreviousStep()} stepIndex={2} totalSteps={3} onSuccess={onSuccess}/> },
  ];

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="modal bg-white p-8 rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Affiliate Signup</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div>{steps[currentStep].component}</div>
      <div className="flex justify-between mt-4">
        <span>Step {currentStep + 1} of {steps.length}</span>
      </div>
    </div>
  );
}
