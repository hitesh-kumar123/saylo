import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { ResumeUploader } from "../components/resume/ResumeUploader";
import { ResumePreview } from "../components/resume/ResumePreview";
import { Card } from "../components/ui/Card";
import { FileText, Check, AlertTriangle } from "lucide-react";
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
                  <p className="text-gray-500">No resumes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-50 ${
                        currentResume?.id === resume.id
                          ? "bg-primary-50 border border-primary-200"
                          : ""
                      }`}
                      onClick={() =>
                        useResumeStore.getState().selectResume(resume.id)
                      }
                    >
                      <FileText
                        className={`h-5 w-5 mr-3 ${
                          currentResume?.id === resume.id
                            ? "text-primary-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {resume.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
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
              <div className="space-y-4 text-sm text-gray-600">
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
