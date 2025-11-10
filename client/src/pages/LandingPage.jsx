import { Link } from "react-router-dom";
import Form from '../components/ContactForm.jsx';
import { Calendar, Target, Bell } from "lucide-react";
import { useEffect, useState } from "react";

function LandingPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                const rect = featuresSection.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    setIsVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col bg-white">
            
            <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="videos/banner2-video.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 px-6 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="text-blue-100">Plan Your Life,</span>
                        <br />
                        <span className="text-white">Live Your Life</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed font-light">
                        Stay organized, motivated, and focused with Life Planner — your all-in-one productivity companion.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        Get Started Free
                    </Link>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to
                            <span className="text-blue-600"> Succeed</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful tools designed to help you organize, plan, and achieve your goals efficiently.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        
                        <div className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Timetables</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Effortlessly plan your daily routines and tasks with our intuitive scheduling tools.
                            </p>
                        </div>

                        
                        <div className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-100`}>
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Goal Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Set, monitor and achieve your goals with clear visual progress insights.
                            </p>
                        </div>

                        
                        <div className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-200`}>
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Bell className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Habits & Reminders</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Build better habits and never miss important moments with smart reminders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            
            <section className="py-16 px-6 bg-gray-50">
                <Form />
            </section>
        </div>
    );
}

export default LandingPage;