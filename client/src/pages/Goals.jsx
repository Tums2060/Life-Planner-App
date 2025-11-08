import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Goals() {
  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const { user } = useAuth(); // Access logged-in user + token

  // Fetch user's goals from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch goals:", res.status);
          return;
        }

        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Error loading goals:", err);
      }
    };

    if (user?.token) fetchGoals();
  }, [user]);

  // Add new goal (POST request)
  const handleAddGoal = async () => {
    console.log("🔵 Button clicked!");
    console.log("New goal value:", newGoal);
    console.log("Trimmed value:", newGoal.trim());
    console.log("Length:", newGoal.length);
    
    alert(`Goal value is: "${newGoal}"`); // ← Temporary alert to see value
    
    if (!newGoal.trim()) {
      console.log("❌ Goal is empty, returning");
      return;
    }
    
    console.log("🚀 About to send request...");
    
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title: newGoal }),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error adding goal:", errorData);
        return;
      }

      const createdGoal = await res.json();
      console.log("✅ Goal created:", createdGoal);
      setGoals([...goals, createdGoal]);
      setNewGoal("");
    } catch (err) {
      console.error("💥 Error adding goal:", err);
    }
  };

  // Delete goal (DELETE request)
  const handleDeleteGoal = async (id) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        setGoals(goals.filter((goal) => goal._id !== id));
      } else {
        console.error("Error deleting goal:", await res.text());
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-semibold mb-6">Goals</h1>

        {/* Add new goal */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="e.g., Read Chapter 5"
            value={newGoal}
            onChange={(e) => {
              console.log("Input changed:", e.target.value);
              setNewGoal(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddGoal();
              }
            }}
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
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center">No goals yet. Add one above!</p>
          ) : (
            goals.map((goal) => (
              <div
                key={goal._id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium text-lg">{goal.title}</p>
                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* Optional extra info */}
                {goal.description && (
                  <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                )}
                {goal.targetDate && (
                  <p className="text-gray-400 text-xs">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center py-6 border-t text-gray-500 text-sm">
        © {new Date().getFullYear()} UniLifePlanner. All rights reserved.
      </footer>
    </div>
  );
}