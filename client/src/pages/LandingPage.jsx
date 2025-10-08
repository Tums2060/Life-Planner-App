import { Link } from "react-router-dom";
import Form from '../components/ContactForm.jsx';

function LandingPage(){
    return (
      <div className="flex flex-col">

        <section className="relative h-[90vh] flex items-center justify-center text-center text-white">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="videos/banner2-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Plan Your Life, Live Your Life
            </h1>
            <p className="max-w-2xl mx-auto text-lg mb-6">
              Life Planner helps you stay organized, motivated  and focused, an all in one simple application.
            </p>
            <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition"
              >Get Started</a>
          </div>

        </section>

        <Form />
      </div>
  );
}

export default LandingPage;