import { useState, useCallback } from 'react';

function InputForm({ onSubmit }) {
  const [company, setCompany] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const [visibleFields, setVisibleFields] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }

    const filledCompetitors = competitors.filter(c => c.trim());
    if (filledCompetitors.length === 0) {
      newErrors.competitors = 'At least one competitor is required';
    } else if (filledCompetitors.length > 4) {
      newErrors.competitors = 'Maximum 4 competitors allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [company, competitors]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const filledCompetitors = competitors.filter(c => c.trim());
        await onSubmit(company.trim(), filledCompetitors);
      } catch (err) {
        console.error('Submit error:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [company, competitors, onSubmit, validateForm]
  );

  const handleCompetitorChange = useCallback((index, value) => {
    const newCompetitors = [...competitors];
    newCompetitors[index] = value;
    setCompetitors(newCompetitors);
  }, [competitors]);

  const addCompetitor = useCallback(() => {
    if (visibleFields < 4) {
      setVisibleFields(visibleFields + 1);
    }
  }, [visibleFields]);

  const removeCompetitor = useCallback(() => {
    if (visibleFields > 1) {
      setVisibleFields(visibleFields - 1);
      const newCompetitors = [...competitors];
      newCompetitors[visibleFields - 1] = '';
      setCompetitors(newCompetitors);
    }
  }, [visibleFields, competitors]);

  const filledCompetitors = competitors.filter(c => c.trim()).length;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-slate-600">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">VyRalis</h2>
        <p className="text-slate-300 text-lg">Analyse YouTube presence across competitors</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-slate-200 mb-2">
            Your Company Name <span className="text-red-400">*</span>
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (errors.company) {
                setErrors({ ...errors, company: '' });
              }
            }}
            placeholder="e.g., Nike"
            className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-700 text-white placeholder-slate-400 focus:outline-none transition-all duration-200 ${
              errors.company
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            }`}
            disabled={isSubmitting}
          />
          {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
        </div>

        {/* Competitors */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Competitors <span className="text-red-400">*</span> ({filledCompetitors}/4)
          </label>

          <div className="space-y-3">
            {competitors.slice(0, visibleFields).map((competitor, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={competitor}
                  onChange={(e) => {
                    handleCompetitorChange(index, e.target.value);
                    if (errors.competitors) {
                      setErrors({ ...errors, competitors: '' });
                    }
                  }}
                  placeholder={`Competitor ${index + 1}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>

          {errors.competitors && <p className="text-red-400 text-sm mt-2">{errors.competitors}</p>}

          {/* Add/Remove Buttons */}
          <div className="flex gap-3 mt-4">
            {visibleFields < 4 && (
              <button
                type="button"
                onClick={addCompetitor}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Competitor
              </button>
            )}
            {visibleFields > 1 && (
              <button
                type="button"
                onClick={removeCompetitor}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                - Remove Competitor
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 mt-8 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-slate-600 disabled:to-slate-500 text-white font-bold text-lg rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Generate Intelligence Report
            </>
          )}
        </button>

        {/* Info text */}
        <p className="text-center text-slate-400 text-xs mt-6">
          This tool analyzes YouTube presence and generates a detailed competitor intelligence report powered by AI.
        </p>
      </form>
    </div>
  );
}

export default InputForm;
