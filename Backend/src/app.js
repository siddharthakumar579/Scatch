const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.set('trust proxy', 1);
app.use(cookieParser())

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

app.use(express.json());

const authrouter = require('../routes/auth.routes')
const interviewRouter = require('../routes/interview.routes')

app.use('/api/auth', authrouter)
app.use('/api/interview', interviewRouter)



app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});


module.exports = app