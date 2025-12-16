import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { InterviewInstructions } from '../components/interview/InterviewInstructions';

export const InterviewInstructionsPage: React.FC = () => {
  return (
    <PageLayout title="Instructions" subtitle="Please read carefully before starting">
      <InterviewInstructions />
    </PageLayout>
  );
};
