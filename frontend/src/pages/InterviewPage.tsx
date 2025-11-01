import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { InterviewSetup } from '../components/interview/InterviewSetup';
import { Card } from '../components/ui/Card';
import { Video, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const InterviewPage: React.FC = () => {
  return (
    <PageLayout title="AI Interview Simulator" subtitle="Practice with realistic AI-powered job interviews">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InterviewSetup />
        </div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card title="How It Works">
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                      <Settings size={16} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Configure</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Select your target role and preferences for the interview.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                      <Video size={16} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Practice</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Engage in a realistic video interview with our AI interviewer.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Review</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Get detailed feedback and metrics to improve your performance.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Tips for Success</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Find a quiet location with good lighting</li>
                      <li>Test your camera and microphone before starting</li>
                      <li>Dress professionally as you would for a real interview</li>
                      <li>Prepare notes but try not to read directly from them</li>
                      <li>Be aware of your body language and eye contact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};