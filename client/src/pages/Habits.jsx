import React, { useState, useEffect } from "react";
import { Flame, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);

  // Get current day and update at midnight
  useEffect(() => {
    const updateDay = () => {
      const now = new Date();
      const dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      // Convert to Mon-Sun format (Mon = 0)
      const adjustedDay = dayIndex === 0 ? 6 : dayIndex - 1;
      setCurrentDay(adjustedDay);
    };

    updateDay();

    // Update day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    const midnightTimer = setTimeout(updateDay, timeUntilMidnight);
    return () => clearTimeout(midnightTimer);
  }, []);

  // Fetch habits from backend on mount
  useEffect(() => {
    if (user?.token) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!newHabit.trim()) {
      toast.error("Please enter a habit name!");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axiosInstance.post("/habits", {
        title: newHabit.trim(),
        description: "",
        frequency: "daily",
      });

      setHabits([response.data, ...habits]);
      setNewHabit("");
      setShowInput(false);
      toast.success("Habit created!");
    } catch (error) {
      console.error("Failed to add habit:", error);
      toast.error("Failed to create habit");
    } finally {
      setSubmitting(false);
    }
  };

  const completeHabit = async (habitId) => {
    try {
      const response = await axiosInstance.patch(`/habits/${habitId}/complete`);

      // Update local state
      setHabits(
        habits.map((habit) =>
          habit._id === habitId ? response.data : habit
        )
      );

      // Show celebration
      setCelebrationMessage(`🔥 Nice! You're on a ${response.data.currentStreak}-day streak!`);
      setTimeout(() => setCelebrationMessage(null), 3000);
      toast.success("Great job! Keep it up!");
    } catch (error) {
      console.error("Failed to complete habit:", error);
      toast.error("Failed to complete habit");
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await axiosInstance.delete(`/habits/${habitId}`);
      setHabits(habits.filter((habit) => habit._id !== habitId));
      toast.success("Habit deleted");
    } catch (error) {
      console.error("Failed to delete habit:", error);
      toast.error("Failed to delete habit");
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const isHabitCompletedToday = (habit) => {
    if (!habit.lastCompleted) return false;
    const lastCompletedDate = new Date(habit.lastCompleted);
    const today = new Date();
    return (
      lastCompletedDate.getUTCFullYear() === today.getUTCFullYear() &&
      lastCompletedDate.getUTCMonth() === today.getUTCMonth() &&
      lastCompletedDate.getUTCDate() === today.getUTCDate()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habits</h1>
          <p className="text-gray-600">
            Build consistency, one day at a time
          </p>
          {currentDay !== null && (
            <p className="text-sm text-blue-600 font-semibold mt-2">
              Today: {weekDays[currentDay]}
            </p>
          )}
        </div>

        {/* Celebration Message */}
        {celebrationMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold text-center animate-bounce">
            {celebrationMessage}
          </div>
        )}

        {/* Add Habit Button / Input */}
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="mb-8 w-full bg-white border-2 border-dashed border-blue-300 hover:border-blue-600 text-blue-600 font-semibold px-6 py-4 rounded-2xl transition duration-200 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition" />
            Add New Habit
          </button>
        ) : (
          <div className="mb-8 bg-white border-2 border-blue-300 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What habit do you want to build?
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addHabit()}
                autoFocus
                placeholder="e.g., Meditate, Study, Exercise..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={submitting}
              />
              <button
                onClick={addHabit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
              >
                {submitting ? "Adding..." : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setNewHabit("");
                }}
                className="px-4 py-3 text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No habits yet. Add one to start your journey!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit, index) => {
              const completedToday = isHabitCompletedToday(habit);

              return (
                <div
                  key={habit._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    {/* Habit Name & Streak */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-6 flex-wrap">
                        {/* Streak Badge */}
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                          <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                          <span className="font-bold text-gray-900">
                            {habit.currentStreak}
                          </span>
                          <span className="text-sm text-gray-600">
                            day streak
                          </span>
                        </div>

                        {/* Longest Streak */}
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                          <span className="text-sm text-gray-600">
                            Best: {habit.longestStreak} days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="text-gray-400 hover:text-red-500 transition p-2 ml-4 flex-shrink-0"
                      title="Delete habit"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Today's Completion Button */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                      Today - {currentDay !== null && weekDays[currentDay]}
                    </p>
                    <button
                      onClick={() => completeHabit(habit._id)}
                      disabled={completedToday}
                      className={`
                        w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 transform
                        ${
                          completedToday
                            ? "bg-blue-600 text-white cursor-not-allowed shadow-md"
                            : "bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-600 active:scale-95"
                        }
                      `}
                    >
                      {completedToday ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Completed Today!
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Mark Complete Today
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Motivational Footer */}
        {habits.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              💡 <span className="font-semibold">Pro tip:</span> Complete your
              habits every day to build an unbreakable streak!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;