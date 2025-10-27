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
            </div>
        </div>


    );
}

export default Timetable;