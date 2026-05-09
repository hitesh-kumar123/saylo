import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    span: ({ children, ...props }) => React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock monaco editor
vi.mock('@monaco-editor/react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'mock-editor' }, 'Monaco Editor'),
}));

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import InterviewSetup from '../pages/InterviewSetup';

describe('Landing Page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(document.body).toBeTruthy();
  });
});

describe('Login Page', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // Check for email/password fields or login button
    const emailInput = document.querySelector('input[type="email"], input[type="text"]');
    expect(emailInput).toBeTruthy();
  });
});

describe('Signup Page', () => {
  it('renders signup form', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const inputs = document.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

describe('InterviewSetup Page', () => {
  it('renders configure interview heading', () => {
    render(
      <MemoryRouter>
        <InterviewSetup />
      </MemoryRouter>
    );
    expect(screen.getByText('Configure Interview')).toBeInTheDocument();
  });

  it('renders interview type options', () => {
    render(
      <MemoryRouter>
        <InterviewSetup />
      </MemoryRouter>
    );
    expect(screen.getByText('Technical Round')).toBeInTheDocument();
    expect(screen.getByText('Behavioral Round')).toBeInTheDocument();
  });

  it('renders interview mode options', () => {
    render(
      <MemoryRouter>
        <InterviewSetup />
      </MemoryRouter>
    );
    expect(screen.getByText('Text Chat')).toBeInTheDocument();
    expect(screen.getByText('Video Call')).toBeInTheDocument();
  });

  it('renders resume upload section', () => {
    render(
      <MemoryRouter>
        <InterviewSetup />
      </MemoryRouter>
    );
    expect(screen.getByText('Resume (Optional)')).toBeInTheDocument();
  });
});
