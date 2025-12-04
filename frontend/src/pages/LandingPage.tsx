import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Video, BarChart2, FileText, Briefcase } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageLayout } from "../components/layout/PageLayout";
import { useAuthStore } from "../store/authStore";

export const LandingPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();

  const features = [
    {
      icon: <Video className="h-6 w-6" />,
      title: "AI Interview Simulator",
      description:
        "Practice with realistic AI-powered video interviews tailored to specific job roles and industries.",
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Performance Metrics",
      description:
        "Get detailed analytics on your interview performance including eye contact, confidence, clarity and more.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Resume Analysis",
      description:
        "Upload your resume to receive personalized feedback and suggestions for improvement.",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Career Guidance",
      description:
        "Explore career paths aligned with your skills and interests, with personalized recommendations.",
    },
  ];

  return (
    <PageLayout noHeader>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div className="flex-shrink-0">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/"}
                  className="text-white font-bold text-xl"
                >
                  saylo<span className="text-accent-400">.hire</span>
                </Link>
              </div>
              <div className="flex space-x-4">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white/10"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white/10"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="accent" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              >
                Master Your Job Interviews with AI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-primary-100 mb-8 max-w-2xl"
              >
                Practice with realistic AI interviews, get real-time feedback,
                and boost your confidence. Your personal interview coach
                available 24/7.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link to="/register">
                  <Button size="lg" variant="accent">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white/10"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-lg transform rotate-3 scale-105 opacity-20 blur-xl"></div>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            AI
                          </span>
                        </div>
                        <div className="bg-gray-700 bg-opacity-70 p-3 rounded-lg">
                          <p className="text-white text-sm">
                            "Tell me about a challenging project you worked on
                            recently."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                          <Video size={14} className="text-white" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <BarChart2 size={14} className="text-white" />
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary-700 text-xs text-white">
                        Live Interview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              How saylo.hire Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you prepare for job interviews with
              realistic simulations and personalized feedback.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              The Path to Interview Success
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              From practice to perfection, we'll guide you every step of the
              way.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

            {/* Steps */}
            {[
              {
                title: "Upload Your Resume",
                description:
                  "Start by uploading your resume to help us tailor the interview experience to your background and target roles.",
                image:
                  "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                title: "Select Your Target Role",
                description:
                  "Choose the specific job role you're targeting so we can customize the interview questions accordingly.",
                image:
                  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
                reverse: true,
              },
              {
                title: "Practice with AI Interviews",
                description:
                  "Engage in realistic interview simulations with our AI interviewer, receiving real-time feedback on your performance.",
                image:
                  "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                title: "Review & Improve",
                description:
                  "Analyze your performance metrics, watch your interview recordings, and implement suggestions to improve your skills.",
                image:
                  "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=600",
                reverse: true,
              },
            ].map((step, index) => (
              <div key={index} className="relative mb-12 md:mb-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`md:flex items-center ${
                    step.reverse ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <div
                      className={`md:max-w-md ${
                        step.reverse
                          ? "md:ml-auto md:mr-12"
                          : "md:mr-auto md:ml-12"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-lg font-bold">
                          {index + 1}
                        </div>
                        <h3 className="ml-3 text-xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Join thousands of job seekers who've improved their interview
              skills with saylo.hire.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "saylo.hire helped me prepare for my product manager interviews. The AI feedback was spot-on and helped me identify weak points in my responses.",
                author: "Sarah J.",
                role: "Product Manager at Tech Co.",
                avatar:
                  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                quote:
                  "After practicing with the AI interviewer for a week, I felt so much more confident. I ended up getting offers from two companies!",
                author: "Michael T.",
                role: "Software Engineer",
                avatar:
                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                quote:
                  "The resume analysis feature gave me insights I never would have thought of. The career path suggestions were surprisingly accurate.",
                author: "Emma L.",
                role: "Marketing Specialist",
                avatar:
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <p className="text-gray-600 italic mb-6">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={testimonial.avatar}
                          alt={testimonial.author}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of successful job seekers who improved their
              interview skills with saylo.hire.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
              <Link to="/register">
                <Button size="lg" variant="accent">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/plans">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">saylo.hire</h3>
              <p className="text-gray-400">
                AI-powered interview preparation and career coaching platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Career Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} saylo.hire. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
};
