import "@testing-library/jest-dom";

// Mock PDF.js
vi.mock("pdfjs-dist", () => ({
  version: "3.11.174",
  GlobalWorkerOptions: {
    workerSrc: "mock-worker-src",
  },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: vi.fn(() =>
        Promise.resolve({
          getTextContent: vi.fn(() =>
            Promise.resolve({
              items: [
                { str: "John Doe" },
                { str: "Software Engineer" },
                { str: "JavaScript, React, Node.js" },
                { str: "Experience: 5 years" },
              ],
            })
          ),
        })
      ),
    }),
  })),
}));

// Mock Jitsi Meet
vi.mock("../../services/jitsiService", () => ({
  jitsiService: {
    initializeJitsi: vi.fn(() =>
      Promise.resolve({
        addListener: vi.fn(),
        removeListener: vi.fn(),
        executeCommand: vi.fn(),
        dispose: vi.fn(),
        isAudioMuted: vi.fn(() => false),
        isVideoMuted: vi.fn(() => false),
        toggleAudio: vi.fn(),
        toggleVideo: vi.fn(),
        getParticipantsInfo: vi.fn(() => []),
      })
    ),
    joinRoom: vi.fn(() => Promise.resolve({})),
    generateRoomName: vi.fn(() => "test-room"),
    isReady: vi.fn(() => true),
    dispose: vi.fn(),
  },
}));

// Mock IndexedDB
const mockDB = {
  users: {
    add: vi.fn(),
    get: vi.fn(),
    where: vi.fn(() => ({ first: vi.fn() })),
    toArray: vi.fn(() => Promise.resolve([])),
  },
  resumes: {
    add: vi.fn(),
    get: vi.fn(),
    where: vi.fn(() => ({ toArray: vi.fn(() => Promise.resolve([])) })),
  },
  interviews: {
    add: vi.fn(),
    get: vi.fn(),
    getInterview: vi.fn(),
    where: vi.fn(() => ({ toArray: vi.fn(() => Promise.resolve([])) })),
  },
  careerPaths: {
    add: vi.fn(),
    toArray: vi.fn(() => Promise.resolve([])),
  },
  resources: {
    add: vi.fn(),
    getResources: vi.fn(),
    toArray: vi.fn(() => Promise.resolve([])),
  },
};

vi.mock("dexie", () => ({
  default: vi.fn(() => mockDB),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: vi.fn(() => "mock-uuid-123"),
  },
});
