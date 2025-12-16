import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { ResumeUploader } from "../components/resume/ResumeUploader";
import { ResumePreview } from "../components/resume/ResumePreview";
import { Card } from "../components/ui/Card";
import { FileText } from "lucide-react";
import { useResumeStore } from "../store/resumeStore";
import { motion } from "framer-motion";

export const ResumePage: React.FC = () => {
  const { resumes, currentResume } = useResumeStore();

  return (
    <PageLayout
      title="Resume Management"
      subtitle="Upload and analyze your resume for better interview preparation"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentResume ? (
            <ResumePreview resume={currentResume} />
          ) : (
            <ResumeUploader />
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card title="Your Resumes">
              {resumes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 dark:text-dark-400">No resumes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                        currentResume?.id === resume.id
                          ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700"
                          : "hover:bg-gray-50 dark:hover:bg-dark-800 border border-transparent"
                      }`}
                      onClick={() =>
                        useResumeStore.getState().selectResume(resume.id)
                      }
                    >
                      <FileText
                        className={`h-5 w-5 mr-3 ${
                          currentResume?.id === resume.id
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-slate-400 dark:text-dark-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {resume.fileName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-dark-400">
                          {new Date(resume.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card title="Resume Tips">
              <div className="space-y-4 text-sm text-slate-600 dark:text-dark-300">
                <p>
                  A strong resume increases your chances of landing interviews.
                  Here are some tips:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tailor your resume for each job application</li>
                  <li>Use action verbs to describe your accomplishments</li>
                  <li>Quantify your achievements with numbers when possible</li>
                  <li>Keep it concise - ideally 1-2 pages</li>
                  <li>Ensure there are no spelling or grammatical errors</li>
                  <li>Use a clean, professional format</li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};
