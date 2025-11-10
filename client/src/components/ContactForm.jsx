import React from 'react';
import { BookOpen } from "lucide-react";  
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from 'react';
import axios from 'axios';



function Form(){
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:5002/api/contact", formData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });  
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err.message);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return(

        <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <button className="px-4 py-1 text-sm text-blue-600 border border-blue-600 rounded-full mb-3 hover:bg-blue-50 transition">
            Get in Touch
          </button>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Let's <span className="text-blue-600">Connect</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have ideas that could take Life Planner to the next level, or
            feedback to make it even better? We'd love to hear from you.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Form Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Send className="text-blue-600 w-5 h-5" />
              Send us a message
            </h3>
            <p className="text-gray-500 mb-8">
              We'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, ideas, or how we can help..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-md font-medium flex justify-center items-center gap-2 transition ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && (
                <p className="text-green-600 text-center mt-4">
                  Message sent successfully! Check your email for confirmation.
                </p>
              )}
            </form>
          </div>

          {/* Contact Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4">
              <Mail className="text-blue-600 w-6 h-6" />
              <div>
                <h4 className="text-gray-800 font-semibold">Email Us</h4>
                <p className="text-gray-600 text-sm">info@lifeplanner.com</p>
                <p className="text-gray-400 text-sm">
                  We respond within 24 hours
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4">
              <Phone className="text-blue-600 w-6 h-6" />
              <div>
                <h4 className="text-gray-800 font-semibold">Call Us</h4>
                <p className="text-gray-600 text-sm">+254 700 123 456</p>
                <p className="text-gray-400 text-sm">Mon-Fri, 9AM-5PM</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4">
              <MapPin className="text-blue-600 w-6 h-6" />
              <div>
                <h4 className="text-gray-800 font-semibold">Visit Us</h4>
                <p className="text-gray-600 text-sm">Nairobi, Kenya</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl shadow-md p-6 flex items-start gap-4">
              <Clock className="text-blue-600 w-6 h-6" />
              <div>
                <h4 className="text-gray-800 font-semibold">Quick Response</h4>
                <p className="text-gray-600 text-sm">
                  We usually respond within a few hours.
                </p>
                <span className="flex items-center text-green-600 text-sm mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Online now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Form;