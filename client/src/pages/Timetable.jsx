import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";

function Timetable() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("month"); // "month" or "week"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    time: "",
    type: "Study",
  });

  // Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/timetable");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        toast.error("Failed to load timetable events");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchEvents();
    }
  }, [user]);

  // Format date to day string (Mon, Tue, etc.)
  const dateToDayString = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  // Format date to YYYY-MM-DD for comparison
  const dateToString = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Get calendar days for the month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Get week days (7 days starting from current date)
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dayString = dateToDayString(date);
    return events
      .filter((e) => e.day === dayString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Handle adding task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!form.time) {
      toast.error("Please select a time");
      return;
    }
    if (!selectedDay) {
      toast.error("Please select a day");
      return;
    }

    try {
      const dayString = dateToDayString(selectedDay);
      const res = await api.post("/timetable", {
        title: form.title,
        day: dayString,
        time: form.time,
        type: form.type,
      });

      setEvents([...events, res.data]);
      toast.success("Task added successfully");

      // Reset form
      setForm({
        title: "",
        time: "",
        type: "Study",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  // Handle delete task
  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/timetable/${eventId}`);
      setEvents(events.filter((e) => e._id !== eventId));
      toast.success("Task deleted");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task");
    }
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

  // Category colors
  const categoryColors = {
    Study: { bg: "bg-green-100", border: "border-green-300", text: "text-green-700", dot: "bg-green-500" },
    Class: { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-700", dot: "bg-orange-500" },
    Personal: { bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-700", dot: "bg-pink-500" },
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Open modal for a specific day
  const openModal = (date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  const calendarDays = getCalendarDays();
  const weekDays = getWeekDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading your timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Timetable</h1>
          <p className="text-gray-600">Plan your week with our beautiful calendar</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Month/Year Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 min-w-[220px]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === "week"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Month View */}
        {viewMode === "month" && (
          <div className="animate-fadeIn">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-700 py-3"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, idx) => (
                <div
                  key={idx}
                  onClick={() => date && openModal(date)}
                  className={`
                    rounded-xl p-3 min-h-[120px] cursor-pointer transition-all duration-200
                    ${
                      !date
                        ? "bg-gray-50"
                        : isToday(date)
                        ? "bg-white border-2 border-blue-600 shadow-md hover:shadow-lg hover:scale-105"
                        : "bg-white border border-gray-200 hover:shadow-md hover:border-gray-300"
                    }
                  `}
                >
                  {date && (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-sm font-bold ${
                            isToday(date) ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {isToday(date) && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Events dots */}
                      <div className="flex flex-wrap gap-1">
                        {getEventsForDate(date).slice(0, 3).map((event) => (
                          <div
                            key={event._id}
                            className={`w-2 h-2 rounded-full ${categoryColors[event.type].dot}`}
                            title={event.title}
                          />
                        ))}
                        {getEventsForDate(date).length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{getEventsForDate(date).length - 3}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week View */}
        {viewMode === "week" && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {weekDays.map((date) => (
                <div
                  key={dateToString(date)}
                  className={`
                    rounded-2xl p-4 transition-all duration-200
                    ${
                      isToday(date)
                        ? "bg-white border-2 border-blue-600 shadow-lg"
                        : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
                    }
                  `}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        {dateToDayString(date)}
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          isToday(date) ? "text-blue-600" : "text-gray-900"
                        }`}
                      >
                        {date.getDate()}
                      </p>
                    </div>
                    <button
                      onClick={() => openModal(date)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Plus className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  {/* Week view tasks */}
                  <div className="space-y-2">
                    {getEventsForDate(date).length > 0 ? (
                      getEventsForDate(date).map((event) => (
                        <div
                          key={event._id}
                          className={`p-2 rounded-lg border ${categoryColors[event.type].bg} ${categoryColors[event.type].border} group relative`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {event.title}
                              </p>
                              <p className="text-xs text-gray-600">{formatTime(event.time)}</p>
                            </div>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white w-full sm:w-full sm:max-w-md rounded-2xl shadow-lg p-6 animate-slideUp sm:animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedDay && (
                    <>
                      Add Task for{" "}
                      <span className="text-blue-600">
                        {selectedDay.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setForm({ title: "", time: "", type: "Study" });
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Study Math"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Study", "Class", "Personal"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm({ ...form, type: cat })}
                        className={`py-2 px-3 rounded-lg font-medium transition ${
                          form.type === cat
                            ? `${categoryColors[cat].bg} ${categoryColors[cat].text} border-2 border-current`
                            : `${categoryColors[cat].bg} ${categoryColors[cat].text} opacity-50 hover:opacity-75`
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setForm({ title: "", time: "", type: "Study" });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Timetable;