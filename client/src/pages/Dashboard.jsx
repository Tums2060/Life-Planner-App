import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import {
  Clock,
  CheckCircle2,
  Flame,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Bell,
  ChevronRight,
  Lightbulb,
  Smile,
  Award,
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    timetable: [],
    goals: [],
    habits: [],
    reminders: [],
  });

  // Motivational quotes
  const quotes = [
    "Every expert was once a beginner. Keep going!",
    "Small progress is still progress. You've got this!",
    "Consistency is the key to success. Keep your streaks alive!",
    "You're closer to your goals than you think. Don't give up!",
    "Your future self will thank you for the work you're doing now.",
    "Stay focused, stay driven. You're doing amazing! ",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Fetch all dashboard data
  useEffect(() => {
    if (user?.token) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [timetableRes, goalsRes, habitsRes, remindersRes] = await Promise.all([
        api.get("/timetable"),
        api.get("/goals"),
        api.get("/habits"),
        api.get("/reminders"),
      ]);

      setData({
        timetable: timetableRes.data || [],
        goals: goalsRes.data || [],
        habits: habitsRes.data || [],
        reminders: remindersRes.data || [],
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Get next task for today
  const getNextTask = () => {
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayName = dayNames[today.getDay()];

    const todayTasks = data.timetable.filter((t) => t.day === todayName);
    if (todayTasks.length === 0) return null;

    // Find the next upcoming task
    const currentTime = today.getHours() * 60 + today.getMinutes();
    const upcoming = todayTasks.find((t) => {
      const [h, m] = t.time.split(":").map(Number);
      const taskTime = h * 60 + m;
      return taskTime >= currentTime;
    });

    return upcoming || todayTasks[todayTasks.length - 1];
  };

  // Calculate goals progress
  const goalsProgress = () => {
    const completed = data.goals.filter((g) => g.isCompleted).length;
    const total = data.goals.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  // Get top habits with streaks
  const topHabits = () => {
    return data.habits
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 3);
  };

  // Get next reminders
  const nextReminders = () => {
    return data.reminders.slice(0, 3);
  };

  // Format time
  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get time until next task
  const getTimeUntil = (taskTime) => {
    const [h, m] = taskTime.split(":").map(Number);
    const now = new Date();
    const taskDate = new Date();
    taskDate.setHours(h, m, 0);

    const diff = Math.floor((taskDate - now) / 60000); // minutes
    if (diff < 0) return "Started";
    if (diff === 0) return "Now!";
    if (diff < 60) return `In ${diff}m`;
    const hours = Math.floor(diff / 60);
    return `In ${hours}h ${diff % 60}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const nextTask = getNextTask();
  const goalsStats = goalsProgress();
  const habits = topHabits();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Smile className="w-10 h-10 text-blue-600 flex-shrink-0" />
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome back, <span className="text-blue-600">{user?.name}!</span>
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            You're doing great — stay consistent today
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Task Card */}
            {nextTask ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">Upcoming Task</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{nextTask.title}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    {getTimeUntil(nextTask.time)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-600">
                    <span className="font-semibold">{formatTime(nextTask.time)}</span>
                    {" "}• {nextTask.type}
                  </span>
                  <button
                    onClick={() => navigate("/Timetable")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    View Schedule <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">No tasks today</h3>
                    <p className="text-gray-600">Great job! You're all caught up.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Goals Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Goals This Week</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {goalsStats.completed} of {goalsStats.total}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/Goals")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${goalsStats.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {goalsStats.percentage.toFixed(0)}% Complete
                  </span>
                  <span className="text-xs text-gray-500">
                    {goalsStats.total - goalsStats.completed} remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Habits Snapshot */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Active Habits</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{habits.length}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/Habits")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {habits.length > 0 ? (
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Flame className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{habit.title}</p>
                          <p className="text-sm text-gray-600">
                            Best: {habit.longestStreak} days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {habit.currentStreak}
                        </p>
                        <p className="text-xs text-gray-600">day streak</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Start building habits to see them here!
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Secondary Cards */}
          <div className="space-y-6">
            {/* Reminders Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Bell className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Reminders</h3>
                </div>
                <button
                  onClick={() => navigate("/Reminders")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {nextReminders().length > 0 ? (
                <div className="space-y-3">
                  {nextReminders().map((reminder, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-2 border-red-400"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {reminder.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {reminder.reminderTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No active reminders
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Tasks Today</span>
                  <span className="text-2xl font-bold">
                    {data.timetable.filter((t) => {
                      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      return t.day === dayNames[new Date().getDay()];
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Active Goals</span>
                  <span className="text-2xl font-bold">
                    {data.goals.filter((g) => !g.isCompleted).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Best Streak</span>
                  <span className="text-2xl font-bold">
                    {habits.length > 0
                      ? Math.max(...habits.map((h) => h.longestStreak))
                      : "0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    Motivation of the Day
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{randomQuote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/Timetable")}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="p-3 bg-blue-100 rounded-lg mb-3 group-hover:scale-110 transition">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">Timetable</p>
            <p className="text-xs text-gray-600 mt-1">Schedule</p>
          </button>

          <button
            onClick={() => navigate("/Goals")}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="p-3 bg-green-100 rounded-lg mb-3 group-hover:scale-110 transition">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Goals</p>
            <p className="text-xs text-gray-600 mt-1">Track Progress</p>
          </button>

          <button
            onClick={() => navigate("/Habits")}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-orange-200 transition-all"
          >
            <div className="p-3 bg-orange-100 rounded-lg mb-3 group-hover:scale-110 transition">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900">Habits</p>
            <p className="text-xs text-gray-600 mt-1">Build Streaks</p>
          </button>

          <button
            onClick={() => navigate("/Reminders")}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-red-200 transition-all"
          >
            <div className="p-3 bg-red-100 rounded-lg mb-3 group-hover:scale-110 transition">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <p className="font-semibold text-gray-900">Reminders</p>
            <p className="text-xs text-gray-600 mt-1">Stay Notified</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
