import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { useResumeStore } from '../../store/resumeStore';
import { motion } from 'framer-motion';

export const ResumeUploader: React.FC = () => {
  const { uploadResume, isLoading, error } = useResumeStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadResume(acceptedFiles[0]);
      }
    },
    [uploadResume]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Resume</h3>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <>
              <FileText className="h-12 w-12 text-primary-500 mb-3" />
              <p className="text-primary-700 font-medium">Drop your resume here</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                Drag & drop your resume here, or click to browse
              </p>
              <p className="text-gray-500 text-sm">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button
          {...getRootProps()}
          variant="primary"
          isLoading={isLoading}
          leftIcon={<Upload size={16} />}
        >
          Upload Resume
        </Button>
      </div>
    </motion.div>
  );
};