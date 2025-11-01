import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { InterviewSession } from '../components/interview/InterviewSession';

export const InterviewSessionPage: React.FC = () => {
  return (
    <PageLayout noHeader>
      <div className="h-screen -mt-6">
        <InterviewSession />
      </div>
    </PageLayout>
  );
};