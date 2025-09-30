import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useResumeStore } from "../../store/resumeStore";
import {
  pdfParserService,
  PDFParserService,
} from "../../services/pdfParserService";
import { motion } from "framer-motion";

export const ResumeUploader: React.FC = () => {
  const { uploadResume, isLoading, error } = useResumeStore();
  const [parsingStatus, setParsingStatus] = useState<
    "idle" | "parsing" | "success" | "error"
  >("idle");
  const [parsingError, setParsingError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validate file
        if (!PDFParserService.isPDF(file)) {
          setParsingError("Please upload a PDF file");
          setParsingStatus("error");
          return;
        }

        if (!PDFParserService.validateFileSize(file)) {
          setParsingError("File size must be less than 10MB");
          setParsingStatus("error");
          return;
        }

        try {
          setParsingStatus("parsing");
          setParsingError(null);

          // Parse the PDF
          const parsedData = await pdfParserService.parseResume(file);

          // Upload with parsed data
          await uploadResume(file, parsedData);

          setParsingStatus("success");
        } catch (err) {
          console.error("Error parsing resume:", err);
          setParsingError(
            err instanceof Error ? err.message : "Failed to parse resume"
          );
          setParsingStatus("error");
        }
      }
    },
    [uploadResume]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Your Resume
      </h3>

      {/* Error Messages */}
      {(error || parsingError) && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">{error || parsingError}</p>
        </div>
      )}

      {/* Success Message */}
      {parsingStatus === "success" && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">Resume parsed and uploaded successfully!</p>
        </div>
      )}

      {/* Parsing Status */}
      {parsingStatus === "parsing" && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-4 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
          <p className="text-sm">Parsing resume content...</p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <>
              <FileText className="h-12 w-12 text-primary-500 mb-3" />
              <p className="text-primary-700 font-medium">
                Drop your resume here
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                Drag & drop your resume here, or click to browse
              </p>
              <p className="text-gray-500 text-sm">
                Supports PDF files (Max 10MB)
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
