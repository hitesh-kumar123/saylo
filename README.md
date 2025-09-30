# SayLO - AI Interview Simulator

A comprehensive, open-source AI-powered interview simulation platform that helps candidates practice and improve their interview skills using advanced local AI technology.

## 🚀 Features

### Core Functionality

- **AI-Powered Interviews**: Advanced local AI system for realistic interview experiences
- **Resume Parsing**: Client-side PDF parsing with intelligent data extraction
- **Video Conferencing**: Integrated Jitsi Meet for video interviews
- **Performance Analytics**: Real-time feedback and performance metrics
- **Career Guidance**: Personalized career path recommendations
- **Local Storage**: Complete privacy with IndexedDB-based data storage

### Technical Highlights

- **100% Open Source**: No external API dependencies
- **Privacy-First**: All data processed locally
- **Offline Capable**: Works without internet connection
- **Modern Stack**: React, TypeScript, Vite, Tailwind CSS
- **Comprehensive Testing**: Full test suite with Vitest

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

### AI & Processing

- **Ollama** - Local AI processing (optional)
- **PDF.js** - Client-side PDF parsing
- **Natural Language Processing** - Text analysis

### Video & Communication

- **Jitsi Meet** - Video conferencing
- **WebRTC** - Real-time communication

### Data Storage

- **IndexedDB** - Local database
- **Dexie** - IndexedDB wrapper

### Testing

- **Vitest** - Test runner
- **Testing Library** - Component testing
- **JSDOM** - DOM simulation

## 📦 Installation

### Prerequisites

- Node.js 20.12.0 or higher
- npm 10.5.0 or higher

### Quick Start (Local Dev)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/saylo.git
   cd saylo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
src/test/
├── setup.ts                 # Test configuration
├── services/                # Service tests
│   ├── pdfParserService.test.ts
│   └── localDataService.test.ts
└── components/              # Component tests
    └── ResumeUploader.test.tsx
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for the frontend (Vite) and a `.env` file for the backend:

```env
# Backend (.env)
PORT=3001
JWT_SECRET=replace-with-a-secure-random-string
# Comma-separated allowed origins for CORS (production frontend URL)
FRONTEND_ORIGIN=http://localhost:5173

# Frontend (.env.local)
VITE_API_URL=http://localhost:3001/api
VITE_JITSI_DOMAIN=meet.jit.si
VITE_OLLAMA_HOST=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b
```

### Ollama Setup (Optional)

For enhanced AI capabilities, install Ollama:

1. **Install Ollama**

   ```bash
   # Windows
   # Download from https://ollama.ai

   # macOS
   brew install ollama

   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama service**

   ```bash
   ollama serve
   ```

3. **Download a model**
   ```bash
   ollama pull llama3.2:3b
   ```

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── career/             # Career guidance components
│   ├── dashboard/          # Dashboard components
│   ├── interview/          # Interview components
│   ├── layout/             # Layout components
│   ├── resume/             # Resume components
│   └── ui/                 # Reusable UI components
├── config/                 # Configuration files
├── data/                   # Static data files
├── pages/                  # Page components
├── services/               # Business logic services
├── store/                  # State management
├── test/                   # Test files
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## 🚀 Key Features Deep Dive

### 1. AI-Powered Interviews

- **Local AI Processing**: Uses Ollama for advanced AI capabilities
- **Dynamic Questions**: AI generates personalized questions based on responses
- **Real-time Analysis**: Immediate feedback and suggestions
- **Fallback System**: Works without Ollama using local AI

### 2. Resume Parsing

- **PDF.js Integration**: Client-side PDF text extraction
- **Smart Parsing**: Extracts skills, experience, education, and personal info
- **100+ Skills Detection**: Automatically identifies technical skills
- **Structured Data**: Converts resume into structured format

### 3. Video Conferencing

- **Jitsi Meet**: Open-source video conferencing
- **WebRTC**: Real-time communication
- **Screen Sharing**: Optional screen sharing capabilities
- **Recording**: Interview session recording

### 4. Performance Analytics

- **Real-time Metrics**: Eye contact, confidence, clarity tracking
- **Emotion Detection**: Simulated emotion analysis
- **Feedback System**: Detailed performance feedback
- **Progress Tracking**: Historical performance data

## 🔒 Privacy & Security

- **Local Processing**: All AI processing happens locally
- **No External APIs**: No data sent to external services
- **IndexedDB Storage**: All data stored locally
- **GDPR Compliant**: Complete data control
- **Open Source**: Full transparency

## 🎯 Performance Optimization

### Bundle Optimization

- **Code Splitting**: Dynamic imports for better loading
- **Tree Shaking**: Removes unused code
- **Minification**: Optimized production builds
- **Lazy Loading**: Components loaded on demand

### Runtime Optimization

- **Debouncing**: Optimized event handlers
- **Memoization**: Cached expensive calculations
- **Virtual Scrolling**: Efficient large list rendering
- **Error Boundaries**: Graceful error handling

## 🐛 Troubleshooting

### Common Issues

1. **PDF Parsing Not Working**

   - Ensure PDF files are valid
   - Check file size (max 10MB)
   - Verify PDF.js worker is loading

2. **Video Not Connecting**

   - Check Jitsi Meet service status
   - Verify browser permissions
   - Try different browser

3. **AI Features Not Available**
   - Install and start Ollama
   - Check Ollama model availability
   - Verify network connectivity

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` to see:

- Raw PDF text extraction
- AI processing logs
- Performance metrics
- Error details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use meaningful commit messages
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** - Local AI processing
- **Jitsi Meet** - Video conferencing
- **PDF.js** - PDF parsing
- **React** - UI framework
- **Vite** - Build tool

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/your-username/saylo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/saylo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/saylo/discussions)

## 🗺️ Roadmap

### Phase 1: Core Features ✅

- [x] Local data storage
- [x] Video conferencing
- [x] AI interview system
- [x] Resume parsing

### Phase 2: Advanced Features 🚧

- [ ] Advanced AI models
- [ ] Interview scheduling
- [ ] Multi-language support
- [ ] Mobile app

### Phase 3: Enterprise Features 📋

- [ ] Team management
- [ ] Analytics dashboard
- [ ] Custom branding
- [ ] API integration

---

**SayLO** - Empowering candidates with AI-driven interview preparation. 🚀

## ☁️ Deployment (Separate Frontend and Backend)

This project is designed to deploy the frontend and backend separately without coupling.

### Backend (Node/Express)

- Ensure a modern Node 20.x runtime on your host (Render/Railway/Fly/EC2/Dokku/PM2, etc.).
- Set environment variables: `PORT`, `JWT_SECRET`, and `FRONTEND_ORIGIN` to your frontend's URL.
- Start command: `npm start` (runs `node server/index.js`).
- Health check endpoint: `/healthz` returns `{ status: "ok" }`.

Example env (production):

```env
PORT=3001
JWT_SECRET=use-a-secure-random-string
FRONTEND_ORIGIN=https://your-frontend.example.com
```

### Frontend (Vite/React)

- Build the static site and host on any static hosting (Vercel/Netlify/Cloudflare Pages/S3+CloudFront/Nginx).
- Configure the API base URL to point at your backend:

```env
VITE_API_URL=https://your-backend.example.com/api
VITE_JITSI_DOMAIN=meet.jit.si
```

Build and deploy:

```bash
npm run build
# Upload the contents of dist/ to your static host
```

### CORS

The backend enforces CORS based on `FRONTEND_ORIGIN` (supports a comma-separated list). For local dev use `http://localhost:5173`. For production, set it to your deployed frontend origin, e.g. `https://your-frontend.example.com`.

### Common Deploy Targets

- Render/Railway/Fly.io for backend: set env vars and use `npm start`.
- Vercel/Netlify for frontend: set `Build Command` to `npm run build` and `Output Directory` to `dist`.

### Node Version Notes

Dev tooling may warn about newer Node for testing. Production runtime uses Node 20.x fine for the backend. Frontend builds on your CI should use Node 20.19+ to satisfy peer warnings from testing tools, or skip installing devDependencies on your CI build for pure static hosting.
