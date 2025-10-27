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
}

export default Timetable;