function ReportPreview({ analysis, companyData }) {
  if (!analysis) return null;

  const executive = analysis.executive_summary || '';
  const leader = analysis.channel_comparison?.leader || '';
  const rankings = analysis.channel_comparison?.rankings || [];
  const engagement = analysis.engagement_analysis || {};
  const gaps = analysis.gap_analysis || {};
  const recommendations = analysis.recommendations || [];
  const scorecard = analysis.scorecard || {};

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary - Hero Card */}
      <div className="bg-gradient-to-br from-red-600/30 to-red-500/20 border-2 border-red-500/50 rounded-2xl p-8 shadow-lg">
        <div className="flex items-start gap-6">
          <div className="text-5xl flex-shrink-0">🏆</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-red-400 mb-3">Overall Winner</h2>
            <p className="text-2xl font-bold text-white mb-3">{leader}</p>
            <p className="text-slate-200 leading-relaxed text-lg">{executive}</p>
          </div>
        </div>
      </div>

      {/* Channel Comparison - Individual Company Cards */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Channel Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyData.map((company, idx) => {
            const stats = company.channel_stats || {};
            const avgs = company.averages || {};

            return (
              <div key={idx} className="bg-slate-800/60 border border-slate-600 rounded-xl p-5 hover:border-red-500/50 transition-all duration-200">
                <h4 className="text-xl font-bold text-red-400 mb-4">{company.company_name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subscribers:</span>
                    <span className="text-white font-semibold">{formatNumber(stats.subscriber_count)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Videos:</span>
                    <span className="text-white font-semibold">{formatNumber(stats.video_count)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Views:</span>
                    <span className="text-white font-semibold">{formatNumber(stats.view_count)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Views/Video:</span>
                      <span className="text-white font-semibold">{formatNumber(avgs.avg_views)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-slate-400">Avg Engagement:</span>
                      <span className="text-white font-semibold">{formatNumber(avgs.avg_likes)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rankings Table */}
      {rankings.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Competitive Rankings</h3>
          <div className="space-y-3">
            {rankings.map((rank, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${
                  rank.rank === 1
                    ? 'bg-yellow-900/20 border-l-yellow-500'
                    : rank.rank === 2
                    ? 'bg-gray-700/20 border-l-gray-400'
                    : 'bg-orange-900/20 border-l-orange-600'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{rank.rank}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">{rank.company}</p>
                  <p className="text-slate-400 text-sm">{rank.reason}</p>
                </div>
                {rank.rank === 1 && <span className="text-2xl">👑</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Insights */}
      {engagement.best_engagement && (
        <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
            <span>📊</span> Engagement Leader: {engagement.best_engagement}
          </h3>
          <p className="text-slate-300 leading-relaxed mb-4">{engagement.insights}</p>
          {engagement.engagement_tips && engagement.engagement_tips.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-slate-200 mb-3">💡 Engagement Tips:</p>
              <ul className="space-y-2">
                {engagement.engagement_tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Content Themes */}
      {analysis.content_themes && Object.keys(analysis.content_themes).length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Content Strategy by Company</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.content_themes).map(([company, themes]) => (
              <div key={company} className="bg-slate-800/50 border border-slate-600 rounded-xl p-5">
                <h4 className="font-bold text-red-400 mb-3 text-lg">{company}</h4>
                <div className="space-y-3">
                  {themes.main_topics && (
                    <div>
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">Main Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {themes.main_topics.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-500/30 text-red-200 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {themes.content_style && (
                    <div>
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">Style</p>
                      <p className="text-sm text-slate-300">{themes.content_style}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gap Analysis - Opportunities */}
      {gaps.opportunity && (
        <div className="bg-purple-900/20 border-2 border-purple-500/50 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span>💡</span> Your Biggest Opportunity
          </h3>
          <p className="text-slate-300 leading-relaxed mb-6 text-lg">{gaps.opportunity}</p>

          {gaps.untapped_topics && gaps.untapped_topics.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-3">📌 Untapped Topics You Could Cover:</p>
              <ul className="space-y-2">
                {gaps.untapped_topics.slice(0, 6).map((topic, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="text-purple-400">→</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Top Recommendations</h3>
          <div className="space-y-4">
            {recommendations.slice(0, 5).map((rec, idx) => {
              const priorityConfig = 
                rec.priority === 'High'
                  ? { bg: 'from-red-600 to-red-500', border: 'border-red-500', label: '🔴 High Priority' }
                  : rec.priority === 'Medium'
                  ? { bg: 'from-yellow-600 to-yellow-500', border: 'border-yellow-500', label: '🟡 Medium Priority' }
                  : { bg: 'from-green-600 to-green-500', border: 'border-green-500', label: '🟢 Low Priority' };

              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-r ${priorityConfig.bg} bg-opacity-20 border-l-4 ${priorityConfig.border} p-5 rounded-lg hover:shadow-lg transition-all duration-200`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-2xl">
                      {rec.priority === 'High' ? '🔥' : rec.priority === 'Medium' ? '⚡' : '✅'}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-300 mb-1">
                        {priorityConfig.label}
                      </p>
                      <p className="font-bold text-white text-lg mb-2">{rec.action}</p>
                      <p className="text-slate-300 text-sm mb-2">{rec.reasoning}</p>
                      <p className="text-slate-400 text-xs italic">
                        Expected impact: {rec.expected_impact}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scorecard */}
      {Object.keys(scorecard).length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Performance Scorecard (0-10)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50 border-b-2 border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-bold">Company</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-bold">Subs</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-bold">Engagement</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-bold">Consistency</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-bold">Content</th>
                  <th className="text-center py-3 px-4 text-red-400 font-bold">Overall</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scorecard).map(([company, scores]) => {
                  const isWinner = company === analysis.winner;
                  return (
                    <tr
                      key={company}
                      className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                        isWinner ? 'bg-gradient-to-r from-red-600/20 to-red-500/10' : ''
                      }`}
                    >
                      <td className={`py-3 px-4 font-bold ${isWinner ? 'text-red-400' : 'text-white'}`}>
                        {isWinner && '👑 '}{company}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-300">{scores.subscriber_score}</td>
                      <td className="py-3 px-4 text-center text-slate-300">{scores.engagement_score}</td>
                      <td className="py-3 px-4 text-center text-slate-300">{scores.consistency_score}</td>
                      <td className="py-3 px-4 text-center text-slate-300">{scores.content_quality_score}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-3 py-1 font-bold rounded-lg ${
                          isWinner
                            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          {scores.overall_score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{companyData.length}</p>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-1">Companies</p>
        </div>
        {analysis.winner && (
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">👑</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-1">{analysis.winner}</p>
          </div>
        )}
        <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{recommendations.length}</p>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-1">Actions</p>
        </div>
      </div>

      {/* Ready to Download */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-slate-600 rounded-xl p-6 text-center">
        <p className="text-slate-300 mb-2">
          ✨ Preview complete! Ready to download your detailed PowerPoint report?
        </p>
        <p className="text-slate-400 text-sm">
          Your report includes all analyses, charts, and actionable recommendations.
        </p>
      </div>
    </div>
  );
}

export default ReportPreview;
