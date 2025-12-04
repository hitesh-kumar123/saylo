import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Video, Briefcase, AlertCircle } from "lucide-react";
import { useInterviewStore } from "../../store/interviewStore";
import { motion } from "framer-motion";

interface InterviewSetupFormData {
  jobTitle: string;
  jobDescription?: string;
}

export const InterviewSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [jobTitleValue, setJobTitleValue] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InterviewSetupFormData>();
  const { startInterview, isLoading, error } = useInterviewStore();
  const navigate = useNavigate();
  
  // Watch jobTitle field
  const watchedJobTitle = watch("jobTitle");

  const onSubmit = async (data: InterviewSetupFormData) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    await startInterview(data.jobTitle);
    navigate("/interview/session");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 mr-3">
                {step === 1 ? <Briefcase size={20} /> : <Video size={20} />}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {step === 1 ? "Job Details" : "Ready to Begin"}
              </h2>
            </div>

            {error && (
              <div className="flex items-start p-4 mb-4 bg-red-50 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    className={`w-full px-3 py-2 border ${
                      errors.jobTitle ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="e.g. Software Engineer, Product Manager"
                    {...register("jobTitle", {
                      required: "Job title is required",
                      onChange: (e) => setJobTitleValue(e.target.value),
                    })}
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="jobDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job Description (Optional)
                  </label>
                  <textarea
                    id="jobDescription"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter job description or specific skills you want to focus on"
                    {...register("jobDescription")}
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary-50 p-4 rounded-md">
                  <p className="text-primary-800 font-medium">
                    Interview for: <span className="font-bold">
                      {watchedJobTitle || jobTitleValue || "Position"}
                    </span>
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-md space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Before you begin:
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Find a quiet place with good lighting</li>
                    <li>Make sure your camera and microphone are working</li>
                    <li>Have a pen and paper ready for notes</li>
                    <li>The interview will last approximately 15-20 minutes</li>
                    <li>You can end the interview at any time</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              isLoading={isLoading}
              className={step === 1 ? "ml-auto" : ""}
            >
              {step === 1 ? "Next" : "Start Interview"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};
