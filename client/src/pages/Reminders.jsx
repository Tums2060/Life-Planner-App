import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { Bell, CalendarClock, Trash2 } from "lucide-react";

const initialForm = {
  type: "Custom",
  message: "",
  remindAt: "",
  via: "email",
};

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reminders");
        setReminders(response.data);
      } catch (error) {
        console.error("Failed to load reminders:", error);
        toast.error("Failed to load reminders");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchReminders();
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.message.trim()) {
      toast.error("Please enter a reminder message");
      return;
    }

    if (!form.remindAt) {
      toast.error("Please choose a date and time");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/reminders", {
        type: form.type,
        message: form.message.trim(),
        remindAt: new Date(form.remindAt).toISOString(),
        via: form.via,
      });

      setReminders((current) => [response.data, ...current]);
      setForm(initialForm);
      toast.success("Reminder created");
    } catch (error) {
      console.error("Failed to create reminder:", error);
      toast.error(error.response?.data?.message || "Failed to create reminder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reminderId) => {
    try {
      await api.delete(`/reminders/${reminderId}`);
      setReminders((current) => current.filter((reminder) => reminder._id !== reminderId));
      toast.success("Reminder removed");
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-500">Loading your reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-semibold">Reminders</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Set reminders that actually notify you</h1>
          <p className="text-gray-600 max-w-2xl">
            Create reminders for goals, timetable events, habits, or anything else you need to keep on track.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Custom">Custom</option>
                <option value="Goal">Goal</option>
                <option value="Timetable">Timetable</option>
                <option value="Habit">Habit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder="Finish your weekly review, study for 30 minutes, pay your bills..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Remind at</label>
                <input
                  type="datetime-local"
                  name="remindAt"
                  value={form.remindAt}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery</label>
                <select
                  name="via"
                  value={form.via}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="email">Email</option>
                  <option value="push">Push</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <CalendarClock className="w-4 h-4" />
              {submitting ? "Saving..." : "Create Reminder"}
            </button>
          </form>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming reminders</h2>
                <p className="text-sm text-gray-500">{reminders.length} total reminder{reminders.length === 1 ? "" : "s"}</p>
              </div>
            </div>

            {reminders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-gray-500">No reminders yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder._id} className="rounded-2xl border border-gray-200 p-4 transition hover:shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                          {reminder.type}
                        </div>
                        <p className="text-gray-900 font-medium">{reminder.message}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(reminder.remindAt).toLocaleString()} · {reminder.via}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(reminder._id)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
