import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../services/api';

export default function ResumeUpload({ sessionId, onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error'
  const [fileName, setFileName] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setUploadStatus('error');
      setFileName('Please upload a PDF file.');
      return;
    }

    setFileName(file.name);
    setUploadStatus(null);

    // If onFileSelect is provided, we pass the file back and skip immediate upload
    if (onUploadComplete && !sessionId) {
       onUploadComplete(file);
       setUploadStatus('success'); // Visual feedback
       return;
    }

    setIsUploading(true);

    try {
      const fakeSessionId = sessionId || "temp_session"; 
      
      const result = await api.uploadResume(fakeSessionId, file);
      
      setUploadStatus('success');
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (error) {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer relative",
          isDragging ? "border-primary-500 bg-primary-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5",
          uploadStatus === 'error' && "border-red-500/50 bg-red-500/5",
          uploadStatus === 'success' && "border-green-500/50 bg-green-500/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resume-upload-input').click()}
      >
        <input 
          type="file" 
          id="resume-upload-input"
          className="hidden" 
          accept=".pdf"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : uploadStatus === 'error' ? (
            <XCircle className="w-8 h-8 text-red-400" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
               <Upload className="w-6 h-6 text-slate-400" />
            </div>
          )}

          <div className="text-sm">
            {isUploading ? (
              <p className="text-slate-300">Parsing resume...</p>
            ) : uploadStatus === 'success' ? (
              <div className="space-y-1">
                <p className="text-green-400 font-medium">Resume parsed successfully</p>
                <p className="text-white/40 text-xs">{fileName}</p>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="space-y-1">
                 <p className="text-red-400 font-medium">Upload failed</p>
                 <p className="text-white/40 text-xs">{fileName}</p>
              </div>
            ) : (
              <>
                 <p className="text-slate-300 font-medium">Click to upload or drag & drop</p>
                 <p className="text-slate-500 text-xs mt-1">PDF only (max 5MB)</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
