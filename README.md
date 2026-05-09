<div align="center">
  <img src="https://assets.puter.site/doge.jpeg" alt="SayLO Logo" width="120" style="border-radius: 50%; display: none;" />
  <h1>🎙️ SayLO - AI Interview Prep Platform</h1>
  <p><strong>Master your interviews with a real-time, conversational AI interviewer.</strong></p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248.svg)](https://www.mongodb.com/)
  [![Gemini](https://img.shields.io/badge/Google_Gemini-AI-FFD700.svg)](https://aistudio.google.com/)
</div>

<br />

## 🌟 What is SayLO?
**SayLO** is a modern, AI-powered platform designed to help freshers and professionals prepare for technical and behavioral interviews. Instead of just answering text prompts, SayLO provides a **hands-free Voice Assistant** experience. 

Powered by **Google's Gemini 2.0 AI**, SayLO dynamically evaluates your answers, adjusts difficulty, and provides deep, actionable feedback at the end of every session.

---

## ✨ Key Features
- 🗣️ **Real-time Voice Interviews:** Speak naturally. The AI listens, evaluates, and talks back using the browser's native Speech API.
- 💬 **Interactive Text Chat Mode:** Prefer typing? SayLO supports rich text-based interviews as well.
- 📄 **Resume Parsing:** Upload your resume and the AI will tailor the interview questions specifically to your experience.
- 📊 **Deep Feedback & Scoring:** Get a final verdict, identify weak areas, and receive actionable tips to improve.
- 🎨 **Premium Aesthetic UI:** A beautifully crafted "Paper & Ink" design system using Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- React Router DOM
- Web Speech API (TTS / STT)

**Backend:**
- Python & FastAPI
- MongoDB (Motor Async Driver)
- Google GenAI (Gemini API)
- PyJWT (Authentication)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v16+)
- **Python** (v3.9+)
- **MongoDB** (Running locally on port `27017`)
- **Google Gemini API Key** ([Get it here for free](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/hitesh-kumar123/saylo.git
cd saylo
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
touch .env
```
Add the following to your `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/saylo
SECRET_KEY=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key_here
```
Run the backend server:
```bash
uvicorn app.main:app --reload
# Backend will run at http://localhost:8000
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env
```
Add the following to your `frontend/.env` file:
```env
VITE_API_URL=http://localhost:8000
```
Run the frontend development server:
```bash
npm run dev
# Frontend will run at http://localhost:5174
```

---

## 🤝 How to Contribute

We welcome contributions from freshers and experienced developers alike! This project is a great place to learn React, FastAPI, or AI integration.

### Contribution Steps
1. **Fork** the repository.
2. **Clone** your forked repo locally.
3. Create a **new branch** for your feature (`git checkout -b feature/AmazingFeature`).
4. Make your changes and **commit** them (`git commit -m 'Add some AmazingFeature'`).
5. **Push** to the branch (`git push origin feature/AmazingFeature`).
6. Open a **Pull Request**.

### Beginner Friendly Areas to Contribute
- **UI Tweaks:** Improving mobile responsiveness or adding new Tailwind animations.
- **Frontend State:** Moving from context API to Redux/Zustand if needed.
- **Backend Analytics:** Creating new FastAPI endpoints to track user progress over time.
- **Speech Settings:** Adding UI controls to change the AI's speaking speed or voice type.

---

## 📝 License
This project is open-source and available under the MIT License.

---
*Built with ❤️ for developers, by developers.*
