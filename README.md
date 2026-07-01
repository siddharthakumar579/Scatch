# InterviewAI

AI-powered interview preparation platform that analyzes your resume against job descriptions, generates personalized interview plans, and builds ATS-friendly resumes — all in one place.

## Features

- **AI Interview Plans** — Paste a job description and upload your resume to get a detailed match analysis, strengths, weaknesses, and tailored interview questions.
- **ATS-Friendly Resume** — Download an optimized resume rewritten by AI to better match the job you're targeting.
- **Report History** — Access your past interview reports anytime from the home page.
- **Authentication** — Secure user accounts with JWT-based auth and HTTP-only cookies.

## Tech Stack

| Layer     | Technologies                                      |
| :-------- | :------------------------------------------------ |
| Frontend  | React 19, Vite, SCSS, React Router, Axios         |
| Backend   | Node.js, Express 5, Mongoose, Multer, Puppeteer   |
| AI        | Google Gemini SDK, Zod (structured output validation) |
| Database  | MongoDB Atlas                                     |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/siddharthakumar579/Scatch.git
   cd Scatch
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd FrontEnd
   npm install
   ```

4. **Create environment file**

   Create a `.env` file inside the `Backend/` folder:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the app

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend
cd Backend
node server.js

# Terminal 2 — Frontend
cd FrontEnd
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

## How It Works

1. **Sign up / Log in** to your account.
2. **Paste a job description** in the left panel on the home page.
3. **Upload your resume** (PDF) or type a self-description in the right panel.
4. **Click Generate** — Gemini AI analyzes the match and creates a personalized interview preparation report.
5. **View your report** with match score, suggested questions, and improvement areas.
6. **Download** an ATS-optimized resume tailored to the job description.
