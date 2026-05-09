import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ResumeUpload from '../components/ResumeUpload';

// Mock the api service
vi.mock('../services/api', () => ({
  api: {
    uploadResume: vi.fn().mockResolvedValue({ status: 'success' }),
  },
}));

describe('ResumeUpload Component', () => {
  it('renders upload area', () => {
    render(<ResumeUpload />);
    expect(screen.getByText('Click to upload or drag & drop')).toBeInTheDocument();
    expect(screen.getByText('PDF only (max 5MB)')).toBeInTheDocument();
  });

  it('rejects non-PDF files', () => {
    const onComplete = vi.fn();
    render(<ResumeUpload onUploadComplete={onComplete} />);

    const input = document.getElementById('resume-upload-input');
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('accepts PDF files and calls onUploadComplete', () => {
    const onComplete = vi.fn();
    render(<ResumeUpload onUploadComplete={onComplete} />);

    const input = document.getElementById('resume-upload-input');
    const file = new File(['pdf content'], 'resume.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    // Since no sessionId, it should call onUploadComplete with the file directly
    expect(onComplete).toHaveBeenCalledWith(file);
    expect(screen.getByText('Resume parsed successfully')).toBeInTheDocument();
  });
});
