import React from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Briefcase, Settings, Cpu, Users, Layers } from "lucide-react";
import { useInterviewStore } from "../../store/interviewStore";
import { motion } from "framer-motion";

export const InterviewSetup: React.FC = () => {
  const { config, setInterviewConfig, goToInstructions } = useInterviewStore();

  const handleRoleSelect = (role: string) => {
    setInterviewConfig({ role });
  };

  const handleTypeSelect = (type: 'technical' | 'hr' | 'mixed') => {
    setInterviewConfig({ type });
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setInterviewConfig({ difficulty });
  };

  const handleContinue = () => {
    // Basic validation: ensure all fields are set (though they have defaults)
    if (config.role && config.type && config.difficulty) {
        goToInstructions();
    }
  };

  const isComplete = !!(config.role && config.type && config.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-3">
              <Settings size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Set up your AI Interview
            </h2>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Customize your interview session to match your goals.
          </p>

          <div className="space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Target Role
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['frontend', 'backend', 'fullstack'].map((role) => (
                  <div
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
                      config.role === role
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500"
                        : "border-slate-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                  >
                   <Briefcase className={`mb-2 w-6 h-6 ${config.role === role ? "text-primary-600" : "text-slate-400"}`} />
                    <span className={`font-medium capitalize ${config.role === role ? "text-primary-700 dark:text-primary-300" : "text-slate-600 dark:text-slate-400"}`}>
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Interview Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'technical', label: 'Technical', icon: Cpu },
                  { id: 'hr', label: 'HR / Behavioral', icon: Users },
                  { id: 'mixed', label: 'Mixed', icon: Layers },
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id as any)}
                    className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
                      config.type === type.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500"
                        : "border-slate-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                  >
                    <type.icon className={`mb-2 w-6 h-6 ${config.type === type.id ? "text-primary-600" : "text-slate-400"}`} />
                    <span className={`font-medium ${config.type === type.id ? "text-primary-700 dark:text-primary-300" : "text-slate-600 dark:text-slate-400"}`}>
                      {type.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

             {/* Difficulty Selection */}
             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((diff) => (
                  <div
                    key={diff}
                    onClick={() => handleDifficultySelect(diff as any)}
                    className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${
                      config.difficulty === diff
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500 text-primary-700 dark:text-primary-300"
                        : "border-slate-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="font-medium capitalize">{diff}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
                onClick={handleContinue} 
                disabled={!isComplete} 
                className="w-full mt-6" 
                size="lg"
            >
              Continue to Instructions
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
