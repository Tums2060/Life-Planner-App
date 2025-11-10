import React, {useState, useEffect} from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

function Timetable(){
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title:"",
        day:"Mon",
        time: "",
        type: "Study",
    });
    const { user } = useAuth();

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

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error("Please enter a title for the event");
            return;
        }
        if (!form.time) {
            toast.error("Please select a time for the event");
            return;
        }

        try {
            const res = await api.post("/timetable", {
                title: form.title,
                day: form.day,
                time: form.time,
                type: form.type,
            });

            setEvents([...events, res.data]);
            toast.success("Event added successfully");

            // Reset form
            setForm({
                title: "",
                day: "Mon",
                time: "",
                type: "Study",
            });
        } catch (err) {
            console.error("Failed to add event:", err);
            toast.error(err.response?.data?.message || "Failed to add event");
        }
    };

    const handleDelete = async (eventId) => {
        try {
            await api.delete(`/timetable/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
            toast.success("Event deleted successfully");
        } catch (err) {
            console.error("Failed to delete event:", err);
            toast.error("Failed to delete event");
        }
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const eventsByDay = days.reduce((acc, day) => {
        acc[day] = events
            .filter((e) => e.day === day)
            .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time
        return acc;
    }, {});

    const typeColors = {
        Study: "bg-green-100 border-green-300 text-green-800",
        Class: "bg-purple-100 border-purple-300 text-purple-800",
        Personal: "bg-yellow-100 border-yellow-300 text-yellow-800",
    };

    // Format time to 12-hour format with AM/PM
    const formatTime = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-1">Timetable</h2>
            <p className="text-gray-500 mb-6">
                Weekley view with color coded events.
            </p>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading your timetable...</p>
                </div>
            ) : (
                <>
                    {/* form */}
                    <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl mb-8">
                        <input 
                        type="text"
                        placeholder="e.g. Computer Networks Lab"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value})}
                        className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[180px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                        <select 
                        value={form.day}
                        onChange={(e) => setForm({ ...form, day: e.target.value})}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        <div className="relative">
                            <label className="block text-xs text-gray-600 mb-1 font-medium">Select Time</label>
                            <input 
                            type="time"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value})}
                            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer w-[130px]"
                            required
                            />
                        </div>

                        <select 
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value})}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="Study">Study</option>
                            <option value="Class">Class</option>
                            <option value="Personal">Personal</option>
                        </select>

                        <button 
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add
                        </button>

                    </div>

                    {/* Week Columns */}
                    <div className="grid grid-cols-7 gap-4">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="border border-gray-200 rounded-xl p-3 flex flex-col min-h-[180px] bg-white shadow-sm"
                            >
                                <h3 className="font-medium text-gray-700 mb-2 border-b pb-2">{day}</h3>

                                {eventsByDay[day]?.length > 0 ? (
                                    eventsByDay[day].map((event) => (
                                        <div
                                            key={event._id}
                                            className={`p-3 mb-2 rounded-lg border-l-4 ${typeColors[event.type]} relative group`}
                                        >
                                            <p className="font-medium text-sm">{event.title}</p>
                                            <p className="text-xs opacity-75 mt-1">{event.type}</p>
                                            <p className="text-xs opacity-75 font-semibold">{formatTime(event.time)}</p>
                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400 text-sm mt-8 text-center">
                                        No events
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
};

export default Timetable;