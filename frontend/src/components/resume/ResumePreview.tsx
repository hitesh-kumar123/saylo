import React from "react";
import { Resume } from "../../types";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  if (!resume.parsedData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">No parsed data available</p>
      </div>
    );
  }

  const { parsedData } = resume;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {parsedData.personalInfo?.name || "Resume Preview"}
          </h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {parsedData.personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {parsedData.personalInfo.email}
              </div>
            )}
            {parsedData.personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {parsedData.personalInfo.phone}
              </div>
            )}
            {parsedData.personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {parsedData.personalInfo.location}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {parsedData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {parsedData.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {parsedData.skills && parsedData.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {parsedData.experience && parsedData.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Experience
            </h3>
            <div className="space-y-4">
              {parsedData.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {exp.position}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium mb-2">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {parsedData.education && parsedData.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Education
            </h3>
            <div className="space-y-3">
              {parsedData.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {edu.degree}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {edu.graduationDate}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium mb-1">
                    {edu.institution}
                  </p>
                  {edu.field && (
                    <p className="text-gray-700 text-sm">{edu.field}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Text (for debugging) */}
        {process.env.NODE_ENV === "development" && parsedData.rawText && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Raw Text (Debug)
            </h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {parsedData.rawText.substring(0, 500)}...
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
};
