# Inter-Viewer AI 🚀

Inter-Viewer AI is a full-stack MERN application that leverages the power of Google's Gemini AI to generate custom, highly-tailored interview preparation strategies. By analyzing a candidate's resume and a specific job description, it provides a comprehensive breakdown of technical questions, behavioral questions, skill gaps, and a day-by-day preparation roadmap.

---

## ✨ Key Features
- **AI-Powered Analysis:** Matches your resume against a target job description to calculate a compatibility score.
- **Custom Interview Questions:** Generates highly relevant Technical and Behavioral questions (with model answers) based on the job requirements.
- **Skill Gap Identification:** Highlights missing skills and ranks them by severity so you know exactly what to study.
- **Day-by-Day Preparation Roadmap:** Creates an actionable study plan leading up to your interview.
- **Secure Authentication:** JWT-based user login and registration.
- **PDF Resume Parsing:** Safely uploads and parses PDF resumes using `multer` and `pdf-parse`.
- **Modern UI/UX:** Built with React, Vite, and custom SCSS featuring glassmorphism, dynamic loaders, and interactive components.

---

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- SCSS (Custom Styles)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- Google Gemini AI API (`@google/genai`)
- JWT (Authentication)
- Multer (File Uploads)
- PDF-Parse (Resume Text Extraction)

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js installed
- A MongoDB URI (Local or Atlas)
- A Google Gemini API Key

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/Scatch.git
cd Scatch
```

### 3. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:3000
```

### 4. Frontend Setup
```bash
cd ../FrontEnd
npm install
```
Create a `.env` file in the `FrontEnd` directory:
```env
VITE_API_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
# App will run on http://localhost:5173
```

---

## 🌍 Deployment
This project is configured for cloud deployment.
- **Frontend:** Deploy the `FrontEnd` folder to **Vercel** or **Netlify**. Make sure to set the `VITE_API_URL` environment variable to your live backend URL.
- **Backend:** Deploy the `Backend` folder to **Railway**. (Railway is highly recommended because it automatically configures the OS environment required for `puppeteer`). Make sure to set the `FRONTEND_URL` environment variable to your live frontend URL to allow CORS.

---

## 📝 License
This project is licensed under the MIT License.