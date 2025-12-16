import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useInterviewStore } from "../../store/interviewStore";
import { Send, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const InterviewSession: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds per question
  
  const { 
    questions, 
    currentQuestionIndex, 
    submitAnswer,
    config
  } = useInterviewStore();
  
  const currentQuestion = questions[currentQuestionIndex];

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
             clearInterval(timer);
             handleAutoSubmit();
             return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex]); // Reset on index change implicitly via reset effect below? No, separate logic.

  // Reset state on new question
  useEffect(() => {
    setTimeLeft(90);
    setAnswer("");
    setIsSubmitting(false);
  }, [currentQuestionIndex]);

  const handleAutoSubmit = () => {
      // Auto submit whatever is in the text area
      // We need to access the latest 'answer' state. 
      // Since this is called from closure, use a ref or ensure dependency?
      // Actually simpler to just call handleSubmit logic with current state 
      // But setState inside interval is tricky with closures. 
      // Let's delegate to a function that uses the ref or just rely on the fact 
      // that we want to trigger submission.
      // Ideally we trigger the same flow.
      handleSubmit(true); 
  };

  const handleSubmit = async (auto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Simulate AI thinking if not auto-submit (or even if auto, to show transition)
    if (!auto) {
        await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
        await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for auto
    }
    
    submitAnswer(answer); 
    // State reset is handled by useEffect on currentQuestionIndex change
  };

  // Helper for auto-submit closure issue
  const answerRef = React.useRef(answer);
  useEffect(() => { answerRef.current = answer; }, [answer]);
  
  // Re-implement auto-submit to use Ref
  useEffect(() => {
     if (timeLeft === 0) {
         submitAnswer(answerRef.current);
     }
  }, [timeLeft, submitAnswer]); 


  if (!currentQuestion) {
     return (
        <div className="flex items-center justify-center h-full">
           <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4 mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading Question...</p>
           </div>
        </div>
     );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full max-w-5xl mx-auto p-4 lg:p-6 flex flex-col gap-6"
    >
        {/* Header Section */}
        {/* Header Section */}
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                    AI Interview in Progress
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {config.role} • {config.difficulty}
                </p>
             </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col w-full md:w-48">
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                        <span>Question {currentQuestionIndex + 1}</span>
                        <span>{questions.length} Total</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary-600 transition-all duration-500"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
                
                <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 20 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                </div>
            </div>
        </Card>

      <div className="grid grid-cols-1 gap-6 flex-grow">
        {/* Question Area */}
        <Card className="flex flex-col min-h-[160px] justify-center relative overflow-hidden">
             {isSubmitting ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 transition-all">
                      <div className="animate-bounce text-4xl mb-4">🤖</div>
                      <p className="text-primary-600 font-medium animate-pulse">AI is thinking...</p>
                 </div>
             ) : null}
             
             <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-xs font-semibold text-primary-700 dark:text-primary-300 w-fit mb-4">
                 {currentQuestion.category}
             </span>
             <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed">
                 {currentQuestion.question}
             </h2>
        </Card>

        {/* Answer Area */}
        <div className="flex flex-col flex-grow">
            <Card className="flex-grow flex flex-col p-0 overflow-hidden border-2 focus-within:border-primary-500 transition-colors shadow-md">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Answer</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Markdown supported</span>
                </div>
                <textarea
                    className="flex-grow p-6 resize-none focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base leading-relaxed"
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={isSubmitting}
                    autoFocus
                    spellCheck={false}
                />
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                     <span className="text-xs text-slate-400">
                         {answer.length} characters
                     </span>
                     <Button 
                        onClick={() => handleSubmit(false)} 
                        isLoading={isSubmitting}
                        disabled={!answer.trim() || isSubmitting}
                        rightIcon={<Send size={16} />}
                        className="px-8"
                    >
                        Submit Answer
                     </Button>
                </div>
            </Card>
        </div>
      </div>
    </motion.div>
  );
};
