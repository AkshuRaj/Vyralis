import { useState, useEffect } from 'react';

function LoadingState({ companies }) {
  const [completedSteps, setCompletedSteps] = useState(0);

  const steps = [
    { icon: '🔍', text: 'Finding YouTube channels' },
    { icon: '📊', text: 'Fetching video data' },
    { icon: '🤖', text: 'Analysing with AI' },
    { icon: '📄', text: 'Building your report' },
  ];

  // Animate steps one by one
  useEffect(() => {
    if (completedSteps < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(completedSteps + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [completedSteps, steps.length]);

  const displayCompanies = companies || [];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl p-12 max-w-2xl mx-auto border border-slate-600">
      {/* Main Spinner */}
      <div className="flex justify-center mb-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-3xl font-bold text-white mb-2 text-center">Analyzing Your Competitors</h3>
      <p className="text-slate-400 text-center mb-8">Building intelligence report...</p>

      {/* Companies Being Analyzed */}
      {displayCompanies.length > 0 && (
        <div className="mb-8">
          <p className="text-slate-300 text-sm font-semibold mb-3">Companies:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {displayCompanies.map((company, index) => (
              <div key={index} className="px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-full">
                <span className="text-slate-200 text-sm font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Progress */}
      <div className="space-y-3 mb-8">
        {steps.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isActive = index === completedSteps;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500/20 border border-green-500/50'
                  : isActive
                  ? 'bg-blue-500/20 border border-blue-500/50'
                  : 'bg-slate-700/50 border border-slate-600'
              }`}
              style={{
                animation: isActive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
              }}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full">
                {isCompleted ? (
                  <svg className="w-5 h-5 text-green-400 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isCompleted
                    ? 'text-green-300'
                    : isActive
                    ? 'text-blue-300'
                    : 'text-slate-400'
                }`}
              >
                {step.text}
              </span>
              {isActive && (
                <div className="flex-grow flex justify-end">
                  <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-400 animate-spin"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Time Message */}
      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center mb-6">
        <p className="text-slate-300 text-sm">
          <span className="font-semibold">⏱️ This takes about 30 seconds...</span>
          <br />
          <span className="text-slate-400">Completed {completedSteps} of {steps.length} steps</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
          style={{ width: `${(completedSteps / steps.length) * 100}%` }}
        ></div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default LoadingState;
