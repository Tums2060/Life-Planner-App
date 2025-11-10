import React, { useState } from "react";
import { CheckCircle2, Trash2, TrendingUp } from "lucide-react";

const Goals = () => {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);

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
      goals.map((g) => {
        if (g.id === id && g.progress < 100) {
          const newProgress = Math.min(g.progress + 10, 100);
          // If progress reaches 100, move to completed
          if (newProgress === 100) {
            const completedGoal = { ...g, progress: 100, completed: true };
            setCompletedGoals([...completedGoals, completedGoal]);
            return null; // Mark for removal
          }
          return { ...g, progress: newProgress };
        }
        return g;
      }).filter(g => g !== null)
    );
  };

  const handleMarkDone = (id) => {
    const goalToComplete = goals.find(g => g.id === id);
    if (goalToComplete) {
      const completedGoal = { ...goalToComplete, progress: 100, completed: true };
      setCompletedGoals([...completedGoals, completedGoal]);
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleDeleteCompleted = (id) => {
    setCompletedGoals(completedGoals.filter(g => g.id !== id));
  };

  const handleDeleteActive = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Goals</h1>
          <p className="text-gray-600">Track your progress and celebrate your achievements</p>
        </div>

        {/* Add Goal Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Add a New Goal</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              placeholder="e.g., Read Chapter 5, Learn TypeScript..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              onClick={handleAddGoal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-sm"
            >
              Add Goal
            </button>
          </div>
        </div>

        {/* Active Goals Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              In Progress
              {goals.length > 0 && (
                <span className="ml-2 text-lg text-gray-500 font-normal">({goals.length})</span>
              )}
            </h2>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No active goals yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{g.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{g.progress}% Complete</p>
                    </div>
                    <button
                      onClick={() => handleDeleteActive(g.id)}
                      className="text-gray-400 hover:text-red-500 transition p-2"
                      title="Delete goal"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${g.progress}%` }}
                    ></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleIncreaseProgress(g.id)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-lg transition duration-200"
                    >
                      + 10% Progress
                    </button>
                    <button
                      onClick={() => handleMarkDone(g.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Goals Section */}
        {completedGoals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Completed
                <span className="ml-2 text-lg text-gray-500 font-normal">({completedGoals.length})</span>
              </h2>
            </div>

            <div className="space-y-3">
              {completedGoals.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{g.title}</h3>
                      <p className="text-sm text-gray-500">100% Complete</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCompleted(g.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 flex-shrink-0"
                    title="Remove from completed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;