import React, {useState, useEffect} from "react";

function Timetable(){
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({
        title:"",
        day:"Mon",
        time: "09:00",
        type: "Study",
    });

    useEffect(() => {

    }, []);

    const handleAdd = () => {
        if (!form.title.trim()) return;

        const newEvent ={
            _id: Date.now(),
            ...form,
        };

        setEvents([...events, newEvent]);

        setForm({
            title: "",
            day: "Mon",
            time: "09:00",
            type: "Study",
        });
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const eventsByDay = days.reduce((acc, day) => {
        acc[day] = events.filter((e) => e.day === day);
        return acc;
    }, {});

    const typeColors ={
        Study: "bg-green-100 border-green-300",
        Class: "bg-purple-100 border-purple-300",
        Personal: "bg-yellow-100 border-yellow-300",
    };


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-1">Timetable</h2>
            <p className="text-gray-500 mb-6">
                Weekley view with color coded events.
            </p>

            {/* form */}
            <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl mb-8">
                <input 
                type="text"
                placeholder="e.g. Computer Networks Lab"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value})}
                className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[180px]"
                />

                <select 
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value})}
                className="border border-gray-300 rounded-lg p-2"
                >
                    {days.map((d) => (
                        <option key={d}>{d}</option>
                    ))}
                </select>

                <input 
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value})}
                className="border border-gray-300 rounded-lg p-2"
                />

                <select 
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value})}
                className="border border-gray-300 rounded-lg p-2"
                >
                    <option>Study</option>
                    <option>Class</option>
                    <option>Personal</option>
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
            className="border border-gray-200 rounded-xl p-3 flex flex-col min-h-[180px]"
          >
            <h3 className="font-medium text-gray-700 mb-2">{day}</h3>

            {eventsByDay[day]?.length > 0 ? (
              eventsByDay[day].map((event) => (
                <div
                  key={event._id}
                  className={`p-3 mb-2 rounded-lg border ${typeColors[event.type]}`}
                >
                  <p className="font-medium text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.type}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
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

        </div>


    );
};

export default Timetable;