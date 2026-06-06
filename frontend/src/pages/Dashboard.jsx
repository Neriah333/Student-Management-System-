import { useEffect, useState } from "react";
import api from "../services/api";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    api.get("/students").then(res => setStudents(res.data));
    api.get("/subjects").then(res => setSubjects(res.data.data || res.data));
    api.get("/assessments").then(res => setAssessments(res.data.data || []));
  }, []);

  // =========================
  // METRICS
  // =========================
  const avgScore =
    assessments.reduce((sum, a) => sum + Number(a.totalScore || 0), 0) /
    (assessments.length || 1);

  // =========================
  // BAR CHART DATA
  // =========================
  const barData = [
    { name: "Students", value: students.length },
    { name: "Subjects", value: subjects.length }
  ];

  // =========================
  // PIE CHART DATA
  // =========================
  const gradeCounts = assessments.reduce((acc, a) => {
    acc[a.grade] = (acc[a.grade] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(gradeCounts).map(key => ({
    name: key,
    value: gradeCounts[key]
  }));

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#fb923c", "#f87171"];

  // =========================
  // LINE CHART DATA (trend)
  // =========================
  const lineData = assessments.map((a, index) => ({
    name: `S${index + 1}`,
    score: Number(a.totalScore || 0)
  }));


  return (
    <div className="p-6 space-y-8">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">
          Students: {students.length}
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          Subjects: {subjects.length}
        </div>

        <div className="bg-purple-500 text-white p-4 rounded">
          Avg Score: {avgScore.toFixed(2)}
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">System Overview</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE CHART ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Grade Distribution</h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= LINE CHART ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Performance Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}