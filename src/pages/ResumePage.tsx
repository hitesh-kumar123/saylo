import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ResumeUploader } from '../components/resume/ResumeUploader';
import { Card } from '../components/ui/Card';
import { FileText, Check, AlertTriangle } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { motion } from 'framer-motion';

export const ResumePage: React.FC = () => {
  const { resumes, currentResume } = useResumeStore();

  return (
    <PageLayout title="Resume Management" subtitle="Upload and analyze your resume for better interview preparation">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentResume ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{currentResume.fileName}</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    Uploaded on {new Date(currentResume.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Analysis</h4>
                  
                  {/* Skills section */}
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {currentResume.parsedData?.skills?.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      )) || (
                        <p className="text-sm text-gray-500 italic">No skills detected</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Experience section */}
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Experience</h5>
                    {currentResume.parsedData?.experience?.map((exp, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{exp.position}</p>
                          <p className="text-xs text-gray-500">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">{exp.company}</p>
                        <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500 italic">No experience detected</p>
                    )}
                  </div>
                  
                  {/* Education section */}
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Education</h5>
                    {currentResume.parsedData?.education?.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm font-medium text-gray-900">{edu.institution}</p>
                        <p className="text-sm text-gray-700">{edu.degree} in {edu.field}</p>
                        <p className="text-xs text-gray-500">Graduated: {edu.graduationDate}</p>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500 italic">No education detected</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-primary-50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-primary-800 mb-2">Resume Improvement Suggestions:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-700">Strong experience section with quantifiable achievements</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-700">Good education credentials relevant to the field</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-700">Consider adding more technical skills relevant to your target role</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-700">Add a summary section to highlight your career objectives</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
                        currentResume?.id === resume.id ? 'bg-primary-50 border border-primary-200' : ''
                      }`}
                      onClick={() => useResumeStore.getState().selectResume(resume.id)}
                    >
                      <FileText className={`h-5 w-5 mr-3 ${currentResume?.id === resume.id ? 'text-primary-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{resume.fileName}</p>
                        <p className="text-xs text-gray-500">{new Date(resume.uploadDate).toLocaleDateString()}</p>
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
                <p>A strong resume increases your chances of landing interviews. Here are some tips:</p>
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