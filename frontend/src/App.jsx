import { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import LoadingState from './components/LoadingState';
import ReportPreview from './components/ReportPreview';
import DownloadButton from './components/DownloadButton';
import './App.css';

// Backend API URL - adjust based on deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [state, setState] = useState('idle'); // idle, loading, results, error
  const [analysis, setAnalysis] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = useCallback(async (company, competitors) => {
    setState('loading');
    setError(null);
    setFormData({ company, competitors });

    try {
      const response = await fetch(`${API_BASE_URL}/analyse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company,
          competitors,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate analysis');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
      setCompanyData(data.company_data);
      setState('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setState('error');
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!formData) return;

    try {
      const response = await fetch(`${API_BASE_URL}/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: formData.company,
          competitors: formData.competitors,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate report');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'competitor-report.pptx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/"/g, '');
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert(`Failed to download report: ${err.message}`);
    }
  }, [formData]);

  const handleRetry = useCallback(() => {
    setState('idle');
    setError(null);
    setAnalysis(null);
    setCompanyData(null);
    setFormData(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VCI</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Vyralis - Video Competitor Intelligence</h1>
            </div>
            <div className="text-slate-300 text-sm">Powered by AI</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {state === 'idle' && <InputForm onSubmit={handleFormSubmit} />}

        {state === 'loading' && <LoadingState companies={formData?.competitors} />}

        {state === 'results' && analysis && companyData && (
          <div className="space-y-6">
            <ReportPreview analysis={analysis} companyData={companyData} />
            <div className="flex gap-4 justify-center">
              <DownloadButton onDownload={handleDownload} />
              <button
                onClick={handleRetry}
                className="px-8 py-3 rounded-lg border-2 border-slate-500 text-slate-200 font-semibold hover:bg-slate-700 hover:border-slate-400 transition-all duration-200"
              >
                ← Back to Form
              </button>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-8 max-w-md mx-auto">
            <div className="flex items-start gap-4">
              <div className="text-red-500 text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong</h3>
                <p className="text-slate-300 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm">
            © 2026 Video Competitor Intelligence Tool. Analyze YouTube presence with AI-powered insights.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
