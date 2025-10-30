import React, { useState } from "react";
import { requestNotificationPermission } from "../utils/requestNotificationPermission";

export default function ReminderSettings() {
  const [settings, setSettings] = useState({
    timetable: true,
    goals: true,
    habits: false,
    email: false,
    push: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (key === "push" && !prev[key]) {
        // Trigger browser permission prompt
        requestNotificationPermission();
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-1">Reminders</h2>
        <p className="text-gray-500 mb-5">Stay on track with friendly notifications.</p>

        {[
          { key: "timetable", title: "Timetable events", desc: "Get notified before classes and scheduled study sessions" },
          { key: "goals", title: "Goals", desc: "Nudges to keep you progressing on goals" },
          { key: "habits", title: "Habits", desc: "Daily reminders to maintain streaks" },
          { key: "email", title: "Email notifications", desc: "Occasional summaries and reminders via email" },
          { key: "push", title: "Push notifications", desc: "Real-time alerts on this device" },
        ].map(({ key, title, desc }) => (
          <div key={key} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
            <button
              onClick={() => handleToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings[key] ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings[key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}

        <p className="text-gray-400 text-xs mt-4">
          You can fine-tune reminder timing and channels later.
        </p>
      </div>
    </div>
  );
}
