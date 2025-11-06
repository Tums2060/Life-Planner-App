import React, { useState } from "react";
import Navbar from "../components/Navbar"; // adjust the path if needed

export default function Goals() {
  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([
    { id: 1, title: "Finish essay", progress: 70 },
    { id: 2, title: "Revise algebra", progress: 45 },
  ]);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now(), title: newGoal, progress: 0 }]);
    setNewGoal("");
  };

  const handleIncreaseProgress = (id) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, progress: Math.min(goal.progress + 10, 100) }
          : goal
      )
    );
  };

  const handleMarkDone = (id) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, progress: 100 } : goal
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-semibold mb-6">Goals</h1>

        {/* Add new goal */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="e.g., Read Chapter 5"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddGoal}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Add Goal
          </button>
        </div>

        {/* Goal List */}
        <div className="space-y-5">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-lg">{goal.title}</p>
                <span className="text-gray-600">{goal.progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleIncreaseProgress(goal.id)}
                  className="px-4 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  +10%
                </button>
                <button
                  onClick={() => handleMarkDone(goal.id)}
                  className="px-4 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center py-6 border-t text-gray-500 text-sm">
        © {new Date().getFullYear()} UniLifePlanner. All rights reserved.
      </footer>
    </div>
  );
}
