import React, { useState, useEffect } from "react";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Helper function to get today's date as YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to check if two dates are consecutive days
  const isConsecutiveDay = (lastDate, currentDate) => {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffTime = current - last;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays === 1;
  };

  // Mock data - will be replaced with API calls when backend is ready
  useEffect(() => {
    // Simulate loading habits from API with date tracking
    const mockHabits = [
      { 
        id: 1, 
        name: "Read 20 mins", 
        lastCompletedDate: "2025-11-08", // Yesterday
        streak: 1,
        completedToday: false
      },
      { 
        id: 2, 
        name: "Exercise 30 minutes", 
        lastCompletedDate: "2025-11-07", // 2 days ago - streak broken!
        streak: 0,
        completedToday: false
      },
      { 
        id: 3, 
        name: "Drink 8 glasses of water", 
        lastCompletedDate: null, // Never completed
        streak: 0,
        completedToday: false
      },
    ];

    // Check each habit and update streak based on dates
    const today = getTodayDate();
    const updatedHabits = mockHabits.map(habit => {
      if (habit.lastCompletedDate === today) {
        // Already completed today
        return { ...habit, completedToday: true };
      } else if (habit.lastCompletedDate && !isConsecutiveDay(habit.lastCompletedDate, today)) {
        // Streak broken - missed a day
        return { ...habit, streak: 0, completedToday: false };
      }
      return habit;
    });

    setHabits(updatedHabits);
  }, []);

  // Add new habit
  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      lastCompletedDate: null,
      streak: 0,
      completedToday: false
    };

    setHabits([...habits, newHabit]);
    setNewHabitName("");
    setShowAddForm(false);

    // TODO: When backend is ready, replace with:
    // await fetch('http://localhost:5000/api/habits', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: newHabitName })
    // });
  };

  // Toggle habit completion for TODAY
  const toggleHabitCompletion = (id) => {
    const today = getTodayDate();
    
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          if (habit.completedToday) {
            // Unchecking - remove today's completion
            return {
              ...habit,
              completedToday: false,
              lastCompletedDate: null,
              streak: Math.max(0, habit.streak - 1)
            };
          } else {
            // Checking - mark as done today
            let newStreak = habit.streak;
            
            if (!habit.lastCompletedDate) {
              // First time doing this habit
              newStreak = 1;
            } else if (isConsecutiveDay(habit.lastCompletedDate, today)) {
              // Consecutive day - increase streak
              newStreak = habit.streak + 1;
            } else {
              // Broke the streak - start over
              newStreak = 1;
            }

            return {
              ...habit,
              completedToday: true,
              lastCompletedDate: today,
              streak: newStreak
            };
          }
        }
        return habit;
      })
    );

    // TODO: When backend is ready, replace with:
    // await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ date: today })
    // });
  };

  const completedCount = habits.filter(h => h.completedToday).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Habits</h1>
            <p className="text-gray-600 text-sm">Build routines with daily check-ins and motivating streaks.</p>
          </div>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
              placeholder="Enter habit name (e.g., Meditate for 10 minutes)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddHabit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHabitName("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Today Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Today</h2>
            <p className="text-xs text-gray-500 mt-1">Complete your habits before midnight to maintain your streak! 🔥</p>
          </div>

          {/* Habits List */}
          <div className="divide-y divide-gray-200">
            {habits.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No habits yet. Click "Add Habit" to get started!
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-4 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex items-center justify-between">
                    {/* Left side: Checkbox and name */}
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition duration-200 ${
                          habit.completedToday
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {habit.completedToday && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </button>
                      <div>
                        <p className={`text-gray-900 ${habit.completedToday ? 'font-medium' : ''}`}>
                          {habit.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {habit.streak === 0 ? (
                            "Start your streak today!"
                          ) : habit.completedToday ? (
                            `${habit.streak} day streak - Keep it up! 🎉`
                          ) : (
                            `${habit.streak} day streak - Complete today to continue!`
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Streak indicator */}
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{habit.streak > 0 ? '🔥' : '⚪'}</span>
                      <span className={`text-lg font-semibold ${habit.streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {habit.streak}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom stats */}
          {habits.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Completed today: <span className="font-semibold text-gray-900">{completedCount}/{habits.length}</span>
              </p>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            Check in daily to keep your streaks going! 🔥
          </p>
        </div>

        {/* Floating Add Button (bottom right like Notes app) */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-200 flex items-center justify-center text-3xl z-50"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Habits;