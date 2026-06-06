import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function Reportcard() {
  const { studentId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/results/report-card/${studentId}`);
        setReport(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load report card.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchReport();
  }, [studentId]);

  const downloadUrl = `${api.defaults.baseURL.replace(/\/$/, "")}/pdf/report-card/${studentId}`;

  if (loading) {
    return <div className="p-6">Loading report card...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!report) {
    return <div className="p-6">No report card available.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Student Report Card</h2>
          <p className="text-sm text-gray-600">Detailed performance and positions.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link to="/students" className="bg-gray-200 px-4 py-2 rounded">
            Back to Students
          </Link>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Student</h3>
          <p><span className="font-semibold">Name:</span> {report.student.name}</p>
          <p><span className="font-semibold">Admission:</span> {report.student.admissionNumber}</p>
          <p><span className="font-semibold">Class:</span> {report.student.class}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Summary</h3>
          <p><span className="font-semibold">Total Score:</span> {report.summary.totalScore}</p>
          <p><span className="font-semibold">Average:</span> {report.summary.average}</p>
          <p><span className="font-semibold">Grade:</span> {report.summary.grade}</p>
          <p><span className="font-semibold">Class Position:</span> {report.summary.classPosition || "N/A"}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-3">Subject Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">CA</th>
                <th className="px-3 py-2">Exam</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Grade</th>
                <th className="px-3 py-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {report.subjects.map((subject) => (
                <tr key={subject.subject} className="border-t">
                  <td className="px-3 py-2">{subject.subject}</td>
                  <td className="px-3 py-2">{subject.ca}</td>
                  <td className="px-3 py-2">{subject.exam}</td>
                  <td className="px-3 py-2">{subject.total}</td>
                  <td className="px-3 py-2">{subject.grade}</td>
                  <td className="px-3 py-2">{subject.position || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
