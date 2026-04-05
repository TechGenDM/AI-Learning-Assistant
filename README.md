<div align="center">

<br/>

```
 █████╗ ██╗    ██╗      ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
██╔══██╗██║    ██║      ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
███████║██║    ██║      ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
██╔══██║██║    ██║      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
██║  ██║██║    ███████╗ ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
╚═╝  ╚═╝╚═╝    ╚══════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
```

### 🎓 Your Intelligent, Personalized Learning Companion — Powered by AI

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

<br/>

**[✨ Live Demo](#)** &nbsp;·&nbsp; **[📖 Documentation](#)** &nbsp;·&nbsp; **[🐛 Report Bug](https://github.com/TechGenDM/AI-Learning-Assistant/issues)** &nbsp;·&nbsp; **[💡 Request Feature](https://github.com/TechGenDM/AI-Learning-Assistant/issues)**

<br/>

---

</div>

<br/>

## 🌟 What is AI Study?

> **AI Study** is a full-stack, AI-powered learning assistant built for students and self-learners who want to **study smarter, not harder**. Upload your documents, chat with an AI tutor, auto-generate quizzes, and track your progress — all in one seamless platform.

Whether you're cramming for exams, mastering a new skill, or exploring a subject out of curiosity — AI Study adapts to *your* pace, *your* materials, and *your* goals.

<br/>

---

## ✨ Core Features

<br/>

### 🤖 AI Chat & Q&A
Engage in real-time, context-aware conversations with an AI tutor trained to explain complex concepts simply. Ask follow-up questions, request analogies, get code explanations — your tutor never gets tired.

- Powered by **OpenAI / Gemini API** for blazing-fast, intelligent responses
- Remembers conversation context for multi-turn dialogues
- Handles STEM, humanities, programming, and more

---

### 📄 PDF & Document Upload & Analysis
Upload your lecture notes, textbooks, or research papers and let the AI extract knowledge from them instantly.

- Drag-and-drop file upload interface
- AI reads, parses, and understands document content
- Ask questions *directly* about your uploaded content
- Supports PDF, DOCX, and TXT formats

---

### 🧠 Quiz & Assessment Generation
Stop making flashcards manually. Let the AI generate custom quizzes from your study material in seconds.

- Auto-generates MCQ, True/False, and short-answer questions
- Difficulty levels: Easy → Medium → Hard
- Instant feedback and explanations for wrong answers
- Powered by document context for hyper-relevant questions

---

### 📊 Progress Tracking & Dashboard
Visualize your learning journey. Know what you've studied, where you're excelling, and what needs more attention.

- Personal dashboard with study streaks and session history
- Quiz score analytics over time
- Topic-wise performance breakdown
- Motivating milestones and insights

<br/>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js (React) | UI, routing, server-side rendering |
| **Backend** | Node.js + Express | REST API, business logic |
| **Database** | MongoDB | User data, sessions, quiz results |
| **AI Engine** | OpenAI / Gemini API | Chat, Q&A, quiz generation |
| **Auth** | JWT / Firebase Auth | Secure user authentication |
| **File Handling** | Multer / PDFParse | Document upload & text extraction |
| **Styling** | Tailwind CSS | Responsive, utility-first design |

<br/>

---

## 📂 Project Structure

```
AI-Learning-Assistant/
│
├── 📁 frontend/                  # Next.js React Application
│   ├── 📁 app/                   # App Router (Next.js 13+)
│   │   ├── 📁 (auth)/            # Auth pages — login, signup
│   │   ├── 📁 dashboard/         # Progress dashboard
│   │   ├── 📁 chat/              # AI Chat interface
│   │   ├── 📁 quiz/              # Quiz generation & attempt
│   │   └── 📁 upload/            # Document upload & analysis
│   ├── 📁 components/            # Reusable UI components
│   ├── 📁 lib/                   # Utility functions & API calls
│   └── 📁 public/                # Static assets
│
├── 📁 backend/                   # Node.js + Express Server
│   ├── 📁 routes/                # API route definitions
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── chat.js               # AI Chat endpoints
│   │   ├── quiz.js               # Quiz generation & submission
│   │   ├── upload.js             # File upload endpoints
│   │   └── progress.js           # User progress endpoints
│   ├── 📁 controllers/           # Route handler logic
│   ├── 📁 models/                # MongoDB Mongoose schemas
│   │   ├── User.js               # User model
│   │   ├── Quiz.js               # Quiz & results model
│   │   ├── Document.js           # Uploaded document model
│   │   └── Progress.js           # Progress tracking model
│   ├── 📁 middleware/            # Auth, error handling
│   ├── 📁 utils/                 # Helper utilities
│   ├── 📁 config/                # DB & environment config
│   └── server.js                 # Express app entry point
│
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

<br/>

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- An **OpenAI** or **Gemini** API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/TechGenDM/AI-Learning-Assistant.git
cd AI-Learning-Assistant
```

---

### 2. Set Up Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# AI API
OPENAI_API_KEY=your_openai_api_key
# OR
GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env.local` file in the `/frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

### 4. Run the Application

**Start the backend server:**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Start the frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:3000
```

Now open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

<br/>

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |
| `GET` | `/api/chat` | Fetch chat history |
| `POST` | `/api/chat/message` | Send message to AI tutor |
| `POST` | `/api/upload` | Upload a PDF/document |
| `GET` | `/api/upload/:id/analyze` | Analyze uploaded document |
| `POST` | `/api/quiz/generate` | Generate quiz from document/topic |
| `POST` | `/api/quiz/submit` | Submit quiz answers |
| `GET` | `/api/progress` | Get user progress & analytics |
| `GET` | `/api/progress/history` | Get session history |

> Full API documentation available in [`/backend/docs/api.md`](./backend/docs/api.md)

<br/>

---

## 📸 Screenshots

<div align="center">

| Dashboard | AI Chat | Quiz Generation |
|:---:|:---:|:---:|
| 📊 | 💬 | 🧠 |
| *Progress overview & analytics* | *Context-aware AI tutor* | *Auto-generated assessments* |

</div>

> 📌 *Add screenshots of your app here by placing images in `/public/screenshots/` and updating this section.*

<br/>

---

## 🗺️ Roadmap

- [x] AI Chat & Q&A with conversation memory
- [x] PDF & document upload and analysis
- [x] Quiz generation from document content
- [x] User progress tracking & dashboard
- [ ] 🔜 Spaced repetition flashcard system
- [ ] 🔜 Multi-language support
- [ ] 🔜 Collaborative study rooms
- [ ] 🔜 Voice-to-text input for chat
- [ ] 🔜 Mobile app (React Native)
- [ ] 🔜 AI-generated study plans & roadmaps

<br/>

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**!

1. **Fork** the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and contribution guidelines.

<br/>

---

## 🐛 Reporting Issues

Found a bug? Have a suggestion?

👉 [Open an Issue](https://github.com/TechGenDM/AI-Learning-Assistant/issues/new) with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable

<br/>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

<br/>

---

## 🙌 Acknowledgements

- [OpenAI](https://openai.com/) — For the powerful AI API
- [Next.js](https://nextjs.org/) — The React framework for production
- [MongoDB](https://mongodb.com/) — Flexible, scalable database
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Vercel](https://vercel.com/) — Seamless frontend deployment

<br/>

---

<div align="center">

**Built with ❤️ by [TechGenDM](https://github.com/TechGenDM)**

*If this project helped you, please consider giving it a ⭐ — it means the world!*

<br/>

[![GitHub stars](https://img.shields.io/github/stars/TechGenDM/AI-Learning-Assistant?style=social)](https://github.com/TechGenDM/AI-Learning-Assistant/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/TechGenDM/AI-Learning-Assistant?style=social)](https://github.com/TechGenDM/AI-Learning-Assistant/network)

</div>