import React, { useState, useEffect } from "react";
import { CheckCircle2, Trash2, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const Goals = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all goals on component mount
  useEffect(() => {
    if (user?.token) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/goals");
      const allGoals = response.data;

      // Separate into active and completed
      const active = allGoals.filter((g) => !g.isCompleted);
      const completed = allGoals.filter((g) => g.isCompleted);

      setGoals(active);
      setCompletedGoals(completed);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal!");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axiosInstance.post("/goals", {
        title: goal.trim(),
        progress: 0,
        isCompleted: false,
      });

      setGoals([response.data, ...goals]);
      setGoal("");
      toast.success("Goal added successfully!");
    } catch (error) {
      console.error("Failed to add goal:", error);
      toast.error("Failed to add goal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIncreaseProgress = async (id, currentProgress) => {
    try {
      const newProgress = Math.min(currentProgress + 10, 100);
      const isCompleted = newProgress === 100;

      const response = await axiosInstance.put(`/goals/${id}`, {
        progress: newProgress,
        isCompleted,
      });

      if (isCompleted) {
        // Move to completed
        setGoals(goals.filter((g) => g._id !== id));
        setCompletedGoals([...completedGoals, response.data]);
        toast.success("Goal completed! 🎉");
      } else {
        // Update in active goals
        setGoals(goals.map((g) => (g._id === id ? response.data : g)));
        toast.success("Progress updated!");
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleMarkDone = async (id) => {
    try {
      const response = await axiosInstance.put(`/goals/${id}`, {
        progress: 100,
        isCompleted: true,
      });

      setGoals(goals.filter((g) => g._id !== id));
      setCompletedGoals([...completedGoals, response.data]);
      toast.success("Goal completed! 🎉");
    } catch (error) {
      console.error("Failed to mark goal as done:", error);
      toast.error("Failed to complete goal");
    }
  };

  const handleDeleteActive = async (id) => {
    try {
      await axiosInstance.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g._id !== id));
      toast.success("Goal deleted");
    } catch (error) {
      console.error("Failed to delete goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const handleDeleteCompleted = async (id) => {
    try {
      await axiosInstance.delete(`/goals/${id}`);
      setCompletedGoals(completedGoals.filter((g) => g._id !== id));
      toast.success("Goal removed");
    } catch (error) {
      console.error("Failed to delete goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-500">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Goals</h1>
          <p className="text-gray-600">
            Track your progress and celebrate your achievements
          </p>
        </div>

        {/* Add Goal Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Add a New Goal
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddGoal()}
              placeholder="e.g., Read Chapter 5, Learn TypeScript..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={submitting}
            />
            <button
              onClick={handleAddGoal}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-sm"
            >
              {submitting ? "Adding..." : "Add Goal"}
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
                <span className="ml-2 text-lg text-gray-500 font-normal">
                  ({goals.length})
                </span>
              )}
            </h2>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">
                No active goals yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((g) => (
                <div
                  key={g._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {g.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {g.progress}% Complete
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteActive(g._id)}
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
                      onClick={() =>
                        handleIncreaseProgress(g._id, g.progress)
                      }
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-lg transition duration-200"
                    >
                      + 10% Progress
                    </button>
                    <button
                      onClick={() => handleMarkDone(g._id)}
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
                <span className="ml-2 text-lg text-gray-500 font-normal">
                  ({completedGoals.length})
                </span>
              </h2>
            </div>

            <div className="space-y-3">
              {completedGoals.map((g) => (
                <div
                  key={g._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {g.title}
                      </h3>
                      <p className="text-sm text-gray-500">100% Complete</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCompleted(g._id)}
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