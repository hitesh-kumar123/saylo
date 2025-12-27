import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useInterviewStore } from "../store/interviewStore";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Eye,
  MessageSquare,
  Smile,
  User,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { InterviewSession, InterviewFeedback, InterviewMetrics } from "../types";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

export const InterviewFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions, fetchSessions } = useInterviewStore();
  const [interview, setInterview] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get interview from location state or from sessions
    const interviewId = location.state?.interviewId;
    if (interviewId) {
      const foundInterview = sessions.find((s) => s.id === interviewId);
      if (foundInterview) {
        setInterview(foundInterview);
        setIsLoading(false);
      } else {
        // Fetch sessions if not found
        fetchSessions().then(() => {
          const updatedSessions = useInterviewStore.getState().sessions;
          const found = updatedSessions.find((s) => s.id === interviewId);
          if (found) {
            setInterview(found);
          }
          setIsLoading(false);
        });
      }
    } else {
      // Get the most recent interview
      if (sessions.length > 0) {
        setInterview(sessions[0]);
      }
      setIsLoading(false);
    }
  }, [location.state, sessions, fetchSessions]);

  if (isLoading) {
    return (
      <PageLayout title="Interview Feedback" subtitle="Loading your interview results...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (!interview) {
    return (
      <PageLayout title="Interview Feedback" subtitle="No interview found">
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-6">No interview data available.</p>
          <Button onClick={() => navigate("/dashboard")} leftIcon={<ArrowLeft size={16} />}>
            Back to Dashboard
          </Button>
        </Card>
      </PageLayout>
    );
  }

  const feedback: InterviewFeedback | undefined = interview.feedback;
  const metrics: InterviewMetrics | undefined = interview.metrics;

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return "N/A";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <PageLayout title="Interview Feedback" subtitle={`Results for ${interview.jobTitle}`}>
      <div className="space-y-6">
        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                <p className="text-primary-100">
                  Interview completed on{" "}
                  {interview.endTime
                    ? new Date(interview.endTime).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
                <p className="text-primary-100">
                  Duration: {formatDuration(interview.startTime, interview.endTime)}
                </p>
              </div>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(feedback?.overallScore || 0)}`}>
                  {feedback?.overallScore?.toFixed(1) || "N/A"}
                </div>
                <div className="text-primary-100 text-sm mt-2">out of 10</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths and Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card title="Strengths" icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}>
              <ul className="space-y-3">
                {feedback?.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                )) || (
                  <li className="text-gray-500">No strengths identified</li>
                )}
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card title="Areas for Improvement" icon={<XCircle className="h-5 w-5 text-yellow-600" />}>
              <ul className="space-y-3">
                {feedback?.weaknesses?.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                )) || (
                  <li className="text-gray-500">No areas for improvement identified</li>
                )}
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Feedback */}
        {feedback?.detailedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card title="Detailed Feedback" icon={<MessageSquare className="h-5 w-5 text-primary-600" />}>
              <p className="text-gray-700 leading-relaxed">{feedback.detailedFeedback}</p>
            </Card>
          </motion.div>
        )}

        {/* Performance Metrics with Radar Chart */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card title="Performance Analysis" icon={<BarChart3 className="h-5 w-5 text-primary-600" />}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                  
                  {/* Radar Chart */}
                  <div className="w-full md:w-1/2 h-[300px] flex justify-center items-center min-w-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                            { subject: 'Eye Contact', A: (metrics.eyeContact || 0) * 10, fullMark: 100 },
                            { subject: 'Confidence', A: (metrics.confidence || 0) * 10, fullMark: 100 },
                            { subject: 'Clarity', A: (metrics.clarity || 0) * 10, fullMark: 100 },
                            { subject: 'Enthusiasm', A: (metrics.enthusiasm || 0) * 10, fullMark: 100 },
                            { subject: 'Posture', A: (metrics.posture || 0) * 10, fullMark: 100 },
                        ]}>
                          <PolarGrid stroke="#cbd5e1" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="You"
                            dataKey="A"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fill="#6366f1"
                            fillOpacity={0.6}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                  </div>

                  {/* Metrics Grid */}
                  <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    <MetricCard
                      icon={<Eye className="h-5 w-5" />}
                      label="Eye Contact"
                      value={metrics.eyeContact}
                      color="text-blue-600"
                    />
                    <MetricCard
                      icon={<User className="h-5 w-5" />}
                      label="Confidence"
                      value={metrics.confidence}
                      color="text-purple-600"
                    />
                    <MetricCard
                      icon={<MessageSquare className="h-5 w-5" />}
                      label="Clarity"
                      value={metrics.clarity}
                      color="text-green-600"
                    />
                    <MetricCard
                      icon={<Smile className="h-5 w-5" />}
                      label="Enthusiasm"
                      value={metrics.enthusiasm}
                      color="text-yellow-600"
                    />
                    <MetricCard
                      icon={<TrendingUp className="h-5 w-5" />}
                      label="Posture"
                      value={metrics.posture}
                      color="text-orange-600"
                    />
                  </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recommendations */}
        {feedback?.recommendations && feedback.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card title="Recommendations" icon={<Award className="h-5 w-5 text-primary-600" />}>
              <ul className="space-y-3">
                {feedback.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => navigate("/interview")}
            variant="primary"
            leftIcon={<TrendingUp size={16} />}
          >
            Start Another Interview
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color }) => {
  const percentage = (value * 10).toFixed(0);

  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className={`flex justify-center mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{percentage}%</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color.replace("text-", "bg-")}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

