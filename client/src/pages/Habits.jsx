import React, { useState, useEffect } from "react";
import { Flame, Plus, Trash2, CheckCircle2 } from "lucide-react";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState(null);

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Sample habits for demo
      setHabits([
        {
          id: 1,
          name: "Morning Exercise",
          streak: 7,
          completedDays: [true, true, true, true, true, true, true],
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "Read for 30 mins",
          streak: 3,
          completedDays: [false, false, true, true, true, false, false],
          createdAt: new Date(),
        },
        {
          id: 3,
          name: "Drink 8 glasses of water",
          streak: 5,
          completedDays: [true, true, true, true, true, false, false],
          createdAt: new Date(),
        },
      ]);
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return;

    const habit = {
      id: Date.now(),
      name: newHabit.trim(),
      streak: 0,
      completedDays: Array(7).fill(false),
      createdAt: new Date(),
    };

    setHabits([habit, ...habits]);
    setNewHabit("");
    setShowInput(false);
  };

  const toggleHabitDay = (habitId, dayIndex) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const updated = { ...habit };
          const wasCompleted = updated.completedDays[dayIndex];

          updated.completedDays[dayIndex] = !wasCompleted;

          // Recalculate streak from the end
          let streak = 0;
          for (let i = 6; i >= 0; i--) {
            if (updated.completedDays[i]) {
              streak++;
            } else {
              break;
            }
          }
          updated.streak = streak;

          // Show celebration if completing today (last day) and streak increases
          if (dayIndex === 6 && !wasCompleted && streak > 0) {
            setCelebrationMessage(`🔥 Nice! You're on a ${streak}-day streak!`);
            setTimeout(() => setCelebrationMessage(null), 3000);
          }

          return updated;
        }
        return habit;
      })
    );
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekProgress = (habit) => {
    const completed = habit.completedDays.filter(Boolean).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habits</h1>
          <p className="text-gray-600">
            Build consistency, one day at a time
          </p>
        </div>

        {/* Celebration Message */}
        {celebrationMessage && (
          <div
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold text-center animate-bounce"
          >
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
              />
              <button
                onClick={addHabit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
              >
                Add
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
            {habits.map((habit, index) => (
              <div
                key={habit.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  {/* Habit Name & Streak */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-6">
                      {/* Streak Badge */}
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                        <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className="font-bold text-gray-900">
                          {habit.streak}
                        </span>
                        <span className="text-sm text-gray-600">day streak</span>
                      </div>

                      {/* Weekly Progress */}
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{
                              width: `${weekProgress(habit)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 w-8">
                          {weekProgress(habit)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 ml-4 flex-shrink-0"
                    title="Delete habit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Weekly Days Grid */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    This Week
                  </p>
                  <div className="flex gap-2 justify-between">
                    {weekDays.map((day, dayIndex) => {
                      const isCompleted = habit.completedDays[dayIndex];
                      const isToday = dayIndex === 6;

                      return (
                        <button
                          key={dayIndex}
                          onClick={() => toggleHabitDay(habit.id, dayIndex)}
                          className={`
                            flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95
                            ${
                              isCompleted
                                ? "bg-blue-600 text-white shadow-md"
                                : isToday
                                  ? "bg-white border-2 border-blue-300 text-gray-700"
                                  : "bg-white border border-gray-200 text-gray-400"
                            }
                          `}
                          title={`${day} - ${isCompleted ? "Completed" : "Not completed"}`}
                        >
                          <span className="text-xs font-bold mb-1">{day}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-current" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Motivational Footer */}
        {habits.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              💡 <span className="font-semibold">Pro tip:</span> Complete your habits every day
              to build an unbreakable streak!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;