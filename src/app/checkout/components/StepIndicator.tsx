import React from 'react';
import { Step } from '../types';

interface StepIndicatorProps {
  currentStep: Step;
  steps: { id: Step; name: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto px-2">
      <div className="flex items-center min-w-max">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center ${i <= currentStepIndex ? 'text-cyan-300' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= currentStepIndex 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                  : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
                {i + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:inline font-medium">{step.name}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px mx-4 transition-all ${
                i < currentStepIndex 
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400' 
                  : 'bg-white/10'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
