import React from 'react';

interface ReportRow {
  attempt_id: number;
  student_name: string;
  student_email: string;
  quiz_title: string;
  score: number;
  total: number;
  percentage: number;
  submitted_at: string;
  minutes_spent: number;
}

interface AdminReportsModalProps {
  reports: ReportRow[];
  onClose: () => void;
}

export const AdminReportsModal: React.FC<AdminReportsModalProps> = ({ reports, onClose }) => {
  const downloadCSV = () => {
    const headers = ['Attempt ID', 'Student Name', 'Email', 'Quiz Title', 'Score', 'Total', 'Percentage (%)', 'Minutes Spent', 'Submitted At'];
    const rows = reports.map(r => [
      r.attempt_id,
      `"${r.student_name}"`,
      r.student_email,
      `"${r.quiz_title}"`,
      r.score,
      r.total,
      r.percentage,
      r.minutes_spent,
      r.submitted_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quizpro_performance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-[#eff4ff] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </div>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                Student Assessment Reports & Analytics
              </h2>
              <p className="text-[11px] text-[#464554]">
                Exportable performance log from SQLite database ({reports.length} records)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadCSV}
              className="px-3.5 py-1.5 rounded-xl bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download CSV</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#767586] hover:bg-[#eff4ff]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Reports Table View */}
        <div className="overflow-x-auto flex-1 rounded-2xl border border-[#eff4ff] no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] text-[#464554] border-b border-[#dce9ff] uppercase font-bold text-[10px]">
                <th className="p-3">ID</th>
                <th className="p-3">Student</th>
                <th className="p-3">Quiz Module</th>
                <th className="p-3 text-right">Score</th>
                <th className="p-3 text-right">Percentage</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff4ff] text-[#0b1c30]">
              {reports.map((row) => {
                const passed = row.percentage >= 70;
                return (
                  <tr key={row.attempt_id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="p-3 font-mono text-[11px] text-[#767586]">#{row.attempt_id}</td>
                    <td className="p-3 font-semibold">
                      <div>{row.student_name}</div>
                      <div className="text-[10px] text-[#767586]">{row.student_email}</div>
                    </td>
                    <td className="p-3 font-medium">{row.quiz_title}</td>
                    <td className="p-3 text-right font-mono font-semibold">
                      {row.score} / {row.total}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {row.percentage}%
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          passed ? 'bg-[#6ffbbe]/40 text-[#006c49]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="p-3 text-[#464554] text-[11px]">
                      {new Date(row.submitted_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
