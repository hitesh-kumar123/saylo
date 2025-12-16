import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Video, BarChart2, FileText, Briefcase, ArrowRight, Users, Zap } from "lucide-react";
import { Button } from "../components/ui/Button";
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
      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/30 dark:bg-primary-600/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-200/30 dark:bg-secondary-600/20 blur-[100px]" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
              saylo.hire
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={logout} className="glass text-slate-900 dark:text-white border-slate-200 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10">
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-grow flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-primary-600 dark:text-primary-300 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    New: GPT-4o Integration
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
                    Master Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse-slow">
                      Dream Job
                    </span>
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                    Practice with our advanced AI interviewer. Get real-time feedback on your confidence, clarity, and technical accuracy.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/register">
                    <Button size="lg" variant="primary" className="w-full sm:w-auto font-semibold h-12 px-8">
                      Start Practicing Free
                    </Button>
                  </Link>
                  <Link to="/demo">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto glass border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 h-12 px-8 gap-2">
                      <Video size={18} />
                      Watch Demo
                    </Button>
                  </Link>
                </motion.div>

                <div className="flex items-center gap-4 text-sm text-slate-500 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-600 dark:text-white">
                        <Users size={12} />
                      </div>
                    ))}
                  </div>
                  <p>Trusted by 10,000+ candidates</p>
                </div>
              </div>

              {/* Hero Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 to-secondary-500/30 rounded-2xl blur-2xl transform rotate-3 scale-105" />
                <div className="relative glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/10 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono">AI Interview Session</div>
                  </div>
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary-500/20 animate-pulse absolute" />
                      <div className="w-24 h-24 rounded-full bg-primary-500/40 animate-pulse delay-75 absolute" />
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center relative shadow-lg shadow-primary-500/50 z-10">
                        <Zap className="text-white fill-current" size={32} />
                      </div>
                    </div>
                    
                    {/* Floating Cards */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-8 right-8 glass bg-white/80 dark:bg-white/10 p-3 rounded-lg border border-white/20 dark:border-white/10 shadow-lg max-w-[150px]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="text-green-400" size={14} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Confidence</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-400 h-full w-[92%]" />
                      </div>
                    </motion.div>

                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-8 left-8 glass bg-white/80 dark:bg-white/10 p-3 rounded-lg border border-white/20 dark:border-white/10 shadow-lg max-w-[180px]"
                    >
                      <div className="text-xs text-slate-500 dark:text-slate-300 mb-1">"Tell me about a time..."</div>
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-primary-500 rounded-full animate-pulse" />
                        <div className="w-1 h-6 bg-primary-400 rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse delay-150" />
                        <div className="w-1 h-5 bg-primary-500 rounded-full animate-pulse delay-100" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to succeed</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our platform provides a comprehensive suite of tools to help you land your dream job.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-primary-500/30 hover:shadow-xl dark:hover:bg-slate-900 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center bg-slate-900 dark:bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to ace your next interview?</h2>
              <p className="text-xl text-slate-100 dark:text-slate-300 mb-8 max-w-2xl mx-auto">Join thousands of candidates who have improved their interview skills with Saylo.</p>
              <Link to="/register">
                <Button size="lg" variant="white" className="font-bold px-8 h-14 rounded-full shadow-lg shadow-black/10 dark:shadow-primary-900/20 text-primary-700">
                  Get Started Now <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
