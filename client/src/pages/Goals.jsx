import React, { useState } from "react";

const Goals = () => {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);

  const handleAddGoal = () => {
    if (!goal.trim()) {
      alert("Please enter a goal!");
      return;
    }

    const newGoal = {
      id: Date.now(),
      title: goal,
      progress: 0,
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setGoal("");
  };

  const handleIncreaseProgress = (id) => {
    setGoals(
      goals.map((g) =>
        g.id === id && g.progress < 100
          ? { ...g, progress: g.progress + 10 }
          : g
      )
    );
  };

  const handleMarkDone = (id) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, progress: 100, completed: true } : g
      )
    );
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Goals</h2>

      <div className="flex mb-6">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Read Chapter 5"
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2"
        />
        <button
          onClick={handleAddGoal}
          className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700"
        >
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-center text-gray-500">No goals yet. Add one above!</p>
      ) : (
        goals.map((g) => (
          <div
            key={g.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{g.title}</h3>
              <span className="text-sm text-gray-600">{g.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${g.progress}%` }}
              ></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleIncreaseProgress(g.id)}
                disabled={g.completed}
                className="bg-purple-100 text-purple-600 px-3 py-1 rounded hover:bg-purple-200"
              >
                +10%
              </button>
              <button
                onClick={() => handleMarkDone(g.id)}
                disabled={g.completed}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Mark Done
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Goals;
