import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getEventStatistics } from "../Actions/event";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#EF4444"]; // Green for completed, Red for remaining

export default function StatisticsPage({ loggedUser }) {
  const { name } = useParams();
  const navigate = useNavigate();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["eventStatistics", name],
    queryFn: () => getEventStatistics(name),
  });

  if (isLoading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div>Loading statistics...</div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-4">
        <div>Error loading statistics.</div>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg font-bold"
          onClick={() => navigate(`/room/${name}`)}
        >
          Back to Event
        </button>
      </div>
    );
  }

  const taskData = [
    { name: "Completed", value: stats.completedTasks },
    { name: "Remaining", value: Math.max(0, stats.totalTasks - stats.completedTasks) },
  ];

  const completionData = [
    { name: "Completion", percentage: stats.completionPercentage },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-start pt-2 px-4 lg:px-8 justify-between">
      <div className="w-full"><Navbar /></div>
      
      <div className="w-full flex flex-col items-center gap-y-8 my-4 flex-1">
        <div className="w-full max-w-6xl flex flex-row justify-between items-center mb-4 border-8 border-gray-600 p-4">
          <h1 className="text-3xl font-bold">Statistics for {name}</h1>
          <button
            className="px-6 py-2 bg-black text-white rounded-lg font-bold"
            onClick={() => navigate(`/room/${name}`)}
          >
            Back to Event
          </button>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-6 border-8 border-gray-600 h-48">
            <h2 className="text-xl font-bold mb-2 text-center">Total Tasks</h2>
            <p className="text-5xl font-black">{stats.totalTasks}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border-8 border-gray-600 h-48">
            <h2 className="text-xl font-bold mb-2 text-center">Participants</h2>
            <p className="text-5xl font-black">{stats.participantCount}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border-8 border-gray-600 h-48">
            <h2 className="text-xl font-bold mb-2 text-center">Days Remaining</h2>
            <p className="text-5xl font-black">{stats.daysRemaining}</p>
          </div>
        </div>

        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center p-6 border-8 border-gray-600">
            <h2 className="text-xl font-bold mb-4 text-center">Task Completion Status</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#10B981]"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#EF4444]"></div>
                <span>Remaining</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center p-6 border-8 border-gray-600">
            <h2 className="text-xl font-bold mb-4 text-center">Completion Percentage</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
