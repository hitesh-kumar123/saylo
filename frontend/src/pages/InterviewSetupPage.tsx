import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { InterviewSetup } from '../components/interview/InterviewSetup';

export const InterviewSetupPage: React.FC = () => {
  return (
    <PageLayout title="Interview Setup" subtitle="Configure your practice session">
      <InterviewSetup />
    </PageLayout>
  );
};
