import { useState } from 'react';

function DownloadButton({ onDownload }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleClick = async () => {
    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      await onDownload();
      setDownloadComplete(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    } catch (err) {
      console.error('Download failed:', err);
      setIsDownloading(false);
    } finally {
      if (!downloadComplete) {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={isDownloading}
        className={`w-full px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
          downloadComplete
            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
            : isDownloading
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
        }`}
      >
        {downloadComplete ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Download Complete!
          </>
        ) : isDownloading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Your Report...
          </>
        ) : (
          <>
            <span className="text-2xl">📥</span>
            Download Full PowerPoint Report
          </>
        )}
      </button>

      {/* File Info Card */}
      {!isDownloading && !downloadComplete && (
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-300">PowerPoint Report</p>
              <p className="text-xs text-slate-400 mt-1">
                12-slide professional analysis with charts and recommendations
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-400">~2-3 MB</p>
              <p className="text-xs text-slate-400 mt-1">File size</p>
            </div>
          </div>
        </div>
      )}

      {downloadComplete && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">✨</span>
            <div>
              <p className="font-semibold text-green-400">Success!</p>
              <p className="text-sm text-slate-300 mt-1">
                Your PowerPoint report has been downloaded. Check your Downloads folder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits List */}
      {!isDownloading && !downloadComplete && (
        <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">Your report includes:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-green-400">✓</span>
              Executive summary with winning strategy
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-green-400">✓</span>
              Competitor rankings and analysis
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-green-400">✓</span>
              Professional charts and visualizations
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-green-400">✓</span>
              Actionable recommendations by priority
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-green-400">✓</span>
              Performance scorecard comparison
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DownloadButton;
