import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const BookingStepper = ({ currentStep, steps, onStepChange }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index < currentStep
                    ? 'bg-amber-500 text-white'
                    : index === currentStep
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <p
                className={`mt-2 text-sm text-center ${
                  index <= currentStep
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t(step.label) || step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  index < currentStep ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingStepper;
