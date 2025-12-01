import React, { useState, useEffect } from 'react';

interface IReportData {
  name: string;
  completions: number;
}

interface ReportPageProps {
  userId: string;
  refreshTrigger?: number;
}

const ReportPage: React.FC<ReportPageProps> = ({ userId, refreshTrigger }) => {
  const [reportData, setReportData] = useState<IReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/reports/weekly/${userId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      setReportData(data.data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [userId, refreshTrigger]);

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/15">
      <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">Weekly Report</h2>

      {loading && <p className="text-gray-300">Loading report...</p>}

      {error && (
        <div className="p-3 backdrop-blur-md bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && reportData.length === 0 && (
        <p className="text-gray-400">No data available. Start logging habits!</p>
      )}

      {!loading && !error && reportData.length > 0 && (
        <div className="space-y-3">
          {reportData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 backdrop-blur-md bg-white/5 rounded-xl border border-white/10"
            >
              <span className="font-medium text-white">{item.name}</span>
              <span className="backdrop-blur-md bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                {item.completions} / 7 days
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchReport}
        className="mt-4 w-full p-3 backdrop-blur-md bg-white/10 text-white font-medium rounded-xl
                   border border-white/20 hover:bg-white/15 active:scale-[0.98] transition-all duration-200"
      >
        Refresh Report
      </button>
    </div>
  );
};

export default ReportPage;