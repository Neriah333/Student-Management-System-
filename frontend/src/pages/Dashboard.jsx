import { useEffect, useState } from "react";
import api from "../services/api";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
  // BAR DATA
  // =========================
  const barData = [
    { name: "Students", value: students.length },
    { name: "Subjects", value: subjects.length }
  ];

  // =========================
  // PIE DATA
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
  // LINE DATA
  // =========================
  const lineData = assessments.map((a, index) => ({
    name: `S${index + 1}`,
    score: Number(a.totalScore || 0)
  }));

  return (
    <div className="p-6 space-y-8">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">Students</h3>
          <p className="text-2xl">{students.length}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">Subjects</h3>
          <p className="text-2xl">{subjects.length}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">Average Score</h3>
          <p className="text-2xl">{avgScore.toFixed(2)}</p>
        </div>

      </div>

      {/* ================= CALENDAR + BAR CHART ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CALENDAR */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Calendar</h2>
          <DayPicker mode="single" />
        </div>

        {/* SYSTEM OVERVIEW */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">System Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= PIE + LINE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Grade Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
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

        {/* LINE CHART */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Performance Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}